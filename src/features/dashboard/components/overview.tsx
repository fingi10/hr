import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Jan', total: 45 },
  { name: 'Feb', total: 52 },
  { name: 'Mar', total: 38 },
  { name: 'Apr', total: 65 },
  { name: 'Mai', total: 48 },
  { name: 'Jun', total: 72 },
  { name: 'Jul', total: 55 },
  { name: 'Aug', total: 63 },
  { name: 'Sep', total: 85 },
  { name: 'Okt', total: 94 },
  { name: 'Nov', total: 78 },
  { name: 'Dez', total: 82 },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
