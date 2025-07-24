interface Props {
  icon: any
  text: string
  value: string
  onClick: () => void
}
const StatButton = ({ icon: Icon, text, value, onClick }: Props) => {
  return (
    <button className="btn btn-outline-secondary stat_button" onClick={onClick}>
      <Icon className="button_icon" />
      <div className="stat_info">
        <span className="stat_text">{text}</span>
        <span className="stat_value">{value}</span>
      </div>
    </button>
  )
}

export default StatButton
