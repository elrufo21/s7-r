import { IconType } from 'react-icons/lib'
import StatButton from './StatButton'

interface Stats {
  icon: IconType
  text: string
  value: string
  onClick: () => void
}

interface Props {
  statsData: Stats[]
}
const StatsButtonBox = ({ statsData }: Props) => {
  const stats = statsData

  return (
    <>
      {stats.map((stat, index) => (
        <StatButton
          key={index}
          icon={stat.icon}
          text={stat.text}
          value={stat.value}
          onClick={stat.onClick}
        />
      ))}
    </>
  )
}

export default StatsButtonBox
