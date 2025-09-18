// LineChart.tsx
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

// Registro obligatorio para gráficos de líneas
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

// Función para ordenar los datos
const sortData = (data: any, order: 'asc' | 'desc' = 'asc') => {
  const combined = data.labels.map((label: string, index: number) => ({
    label,
    value: data.datasets[0].data[index],
  }))

  combined.sort((a: any, b: any) => (order === 'asc' ? a.value - b.value : b.value - a.value))

  const sortedLabels = combined.map((item: any) => item.label)
  const sortedValues = combined.map((item: any) => item.value)

  return {
    ...data,
    labels: sortedLabels,
    datasets: [
      {
        ...data.datasets[0],
        data: sortedValues,
      },
    ],
  }
}

// Componente LineChart con orden opcional
const LineChart = ({ data, options, order = 'asc' }: any) => {
  const sortedData = sortData(data, order)

  return <Line className="w-full" data={sortedData} options={options} />
}

export default LineChart
