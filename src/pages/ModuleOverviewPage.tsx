import { ModulesEnum } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { useClearActionState } from '@/store/helpers/clearActionState'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const menuItems = [
  { title: 'Contactos', href: '/contacts', image: 'contacts' },
  { title: 'Facturación / Contabilidad', href: '/action/187', image: 'invoicing' },
  { title: 'Inventario', href: '/inventory', image: 'inventory' },
  { title: 'Punto de venta', href: '/points-of-sale', image: 'POS' },
  { title: 'Ajustes', href: '/settings', image: 'settings' },
]

const MenuModules = () => {
  const { setAppShowPrevView, setDinamicModule, config } = useAppStore()
  const { clearActionState } = useClearActionState()

  const clickModule = () => {
    setAppShowPrevView(true)
    clearActionState()
  }

  useEffect(() => {
    localStorage.setItem('module', ModulesEnum.SETTINGS)
    setDinamicModule(ModulesEnum.SETTINGS)
  }, [config])
  return (
    <div className="o_home_menu mt-10">
      <div className="container">
        <div className="o_apps row user-select-none mt-5 mx-0 justify-center">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="col-3 col-md-2 o_draggable mb-3 px-0"
              onClick={clickModule}
            >
              <Link
                className="o_app o_menuitem d-flex flex-column rounded-3 justify-content-start align-items-center w-100 p-1 p-md-2 cursor-pointer"
                to={item.href}
              >
                <img
                  className="o_app_icon rounded-3"
                  alt={item.title}
                  src={`/images/modules/${item.image}.png `}
                  height={100}
                  width={100}
                />
                <div className="o_caption w-100 text-center text-truncate mt-2">{item.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuModules
