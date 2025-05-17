import { useLocation } from 'react-router-dom'

const SettingSideBar = ({
  tabs,
}: {
  tabs: { key: string; href: string; img: string; label: string }[]
}) => {
  const { hash } = useLocation()
  return (
    <div className="position-sticky top-0 flex-grow-0 z-1 h-screen ">
      <div className="settings_tab h-100 border-end">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            className={`tab ${hash === tab.href ? 'bg-gray-100' : ''}`}
            role="tab"
            data-key={tab.key}
            href={tab.href}
          >
            <span
              className="icon d-none d-md-block"
              style={{
                background: `url('${tab.img}') no-repeat center`,
                backgroundSize: 'cover',
              }}
            ></span>
            <span className="app_name">{tab.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default SettingSideBar
