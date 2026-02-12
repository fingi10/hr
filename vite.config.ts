import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { Agent, fetch as undiciFetch } from 'undici'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Create an agent that ignores SSL certificate errors (for development only)
  const httpsAgent = new Agent({
    connect: {
      rejectUnauthorized: false
    }
  })
  
  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      {
        name: 'explorium-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/explorium')) {
              try {
                const url = new URL(req.url, 'http://localhost')
                const endpoint = url.searchParams.get('endpoint') || 'prospects'
                const apiKey = env.VITE_EXPLORIUM_API_KEY

                if (!apiKey) {
                  console.error('❌ API key not found in environment variables')
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'API key not configured' }))
                  return
                }

                console.log('✅ API key found, making request to:', `https://api.explorium.ai/v1/${endpoint}`)

                // Read request body
                let body = ''
                req.on('data', chunk => {
                  body += chunk.toString()
                })

                req.on('end', async () => {
                  try {
                    // Use undici fetch with custom agent to bypass SSL issues
                    const response = await undiciFetch(`https://api.explorium.ai/v1/${endpoint}`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'api_key': apiKey,
                      },
                      body: body,
                      dispatcher: httpsAgent,
                    })

                    const data = await response.json()

                    console.log('✅ Explorium API response:', response.status)

                    res.statusCode = response.status
                    res.setHeader('Content-Type', 'application/json')
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.end(JSON.stringify(data))
                  } catch (error) {
                    console.error('❌ Explorium API error:', error)
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ 
                      error: 'Failed to fetch from Explorium API',
                      message: error instanceof Error ? error.message : 'Unknown error'
                    }))
                  }
                })
              } catch (error) {
                console.error('❌ Proxy error:', error)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Proxy error' }))
              }
            } else {
              next()
            }
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
