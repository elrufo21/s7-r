import { IconType } from 'react-icons/lib'
import StatButton from './StatButton'

interface Stats {
  icon: IconType
  text: string
  value: string
  onClick: () => void
  condition?: (formItem: any) => boolean
}

interface Props {
  statsData: Stats[]
  formItem: any
}
const StatsButtonBox = ({ statsData, formItem }: Props) => {
  const stats = statsData
  return (
    <>
      {stats.map((stat, index) => {
        if (stat?.condition && !stat?.condition(formItem)) return null
        return (
          <StatButton
            key={index}
            icon={stat.icon}
            text={stat.text}
            value={formItem ? formItem[stat.value] : stat.value}
            onClick={stat.onClick}
          />
        )
      })}
    </>
  )
}

export default StatsButtonBox
