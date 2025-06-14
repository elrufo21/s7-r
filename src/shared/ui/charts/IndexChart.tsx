import BarChart from './BarChart'
import LineChart from './LineChart'
import PieChart from './PieChart'

const IndexChart = ({ chartType, order }: any) => {
  const data = {
    labels: ['Debido', '19 - 25 may', 'Esta semana', '2 - 8 jun', '9 - 15 jun', 'No adeudado'],
    datasets: [
      {
        label: 'Ventas',
        data: [5, 0, 10, 0, 0, 0], // Datos de ejemplo
        backgroundColor: [
          'rgba(200, 180, 200, 0.6)', // Debido
          'rgba(0, 0, 0, 0)', // 19-25 may (vacío)
          'rgba(0, 180, 180, 0.6)', // Esta semana
          'rgba(0, 0, 0, 0)', // 2-8 jun
          'rgba(0, 0, 0, 0)', // 9-15 jun
          'rgba(0, 0, 0, 0)', // No adeudado
        ],
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }
  if (chartType === 'bar') {
    return <BarChart data={data} options={options} order={order} />
  } else if (chartType === 'line') {
    return <LineChart data={data} options={options} order={order} />
  } else if (chartType === 'pie') {
    return <PieChart data={data} options={options} order={order} />
  }
}

export default IndexChart
