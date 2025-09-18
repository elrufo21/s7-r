import { Bar } from 'react-chartjs-2'

// Función para ordenar etiquetas, valores y colores
const sortData = (data: any, order: 'asc' | 'desc' = 'asc') => {
  const combined = data.labels.map((label: string, index: number) => ({
    label,
    value: data.datasets[0].data[index],
    color: data.datasets[0].backgroundColor[index],
  }))

  // Ordenar
  combined.sort((a: any, b: any) => (order === 'asc' ? a.value - b.value : b.value - a.value))

  // Separar de nuevo
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

// Componente BarChart
const BarChart = ({ data, options, order = 'asc' }: any) => {
  const sortedData = sortData(data, order)

  return <Bar className="w-full" data={sortedData} options={options} />
}

export default BarChart
