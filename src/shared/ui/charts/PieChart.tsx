// PieChart.tsx
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Registro obligatorio para PieChart
ChartJS.register(ArcElement, Tooltip, Legend)

// Función para ordenar datos y colores
const sortData = (data: any, order: 'asc' | 'desc' = 'asc') => {
  const combined = data.labels.map((label: string, index: number) => ({
    label,
    value: data.datasets[0].data[index],
    color: data.datasets[0].backgroundColor?.[index] ?? undefined,
  }))

  // Ordenar por valor
  combined.sort((a: any, b: any) => (order === 'asc' ? a.value - b.value : b.value - a.value))

  const sortedLabels = combined.map((item: any) => item.label)
  const sortedValues = combined.map((item: any) => item.value)
  const sortedColors = combined.map((item: any) => item.color)

  return {
    ...data,
    labels: sortedLabels,
    datasets: [
      {
        ...data.datasets[0],
        data: sortedValues,
        backgroundColor: sortedColors,
      },
    ],
  }
}

// Componente PieChart con ordenamiento
const PieChart = ({ data, options, order = 'asc' }: any) => {
  const sortedData = sortData(data, order)

  return <Pie height={500} className="w-full center" data={sortedData} options={options} />
}

export default PieChart
