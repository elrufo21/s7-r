import { FC, Suspense, lazy } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, MenuItem, ListItemText, Typography } from '@mui/material'
import { Icons } from '@/shared/components/Icons'
import { navigationList } from '@/shared/components/navigation/top-navigation/consts/navigationList'
import useAppStore from '@/store/app/appStore'
import { RiArrowRightSLine } from 'react-icons/ri'
import { ModulesEnum } from '@/shared/shared.types'
import { MenuItemType } from '../navigation.types'
import { useForm } from 'react-hook-form'
import useUserStore from '@/store/persist/persistStore'
import { FrmBaseDialog } from '../../core'

const NavMenuList = lazy(
  () => import('@/shared/components/navigation/top-navigation/components/NavMenuList')
)

const NavBuilder: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    appShowPrevView,
    config,
    setViewTypeFromConfig,
    setListCurrentPage,
    setKanbanCurrentPage,
    setActualCurrentPage,
    setFiltersLocal,
    setSearchFiltersLabel,
    previousDataBeforeMenu,
    setPreviousDataBeforeMenu,
    setDinamicModule,
    breadcrumb,
    setBreadcrumb,
    executeFnc,
  } = useAppStore((state) => state)
  const { setAditionalFilters } = useUserStore()
  const { default_values } = config
  const { watch } = useForm<any>({ defaultValues: default_values })
  const { module } = config
  const navigation = pathname === '/app' ? ModulesEnum.BASE : navigationList[module]
  const { openDialog, closeDialogWithData } = useAppStore()
  const resetView = () => {
    setViewTypeFromConfig(true)
    setFiltersLocal([])
    setSearchFiltersLabel([])
    setDinamicModule(ModulesEnum.SETTINGS)
    setListCurrentPage(1)
    setKanbanCurrentPage(1)
    setActualCurrentPage(1)
    setAditionalFilters([])
    setBreadcrumb([])
    setPreviousDataBeforeMenu({
      formItem: watch(),
      breadcrumb: breadcrumb,
      url: pathname,
    })
  }

  const backToPreviousData = () => {
    const { url } = previousDataBeforeMenu
    if (url) {
      navigate(url)
    }
  }

  const renderNavigationItems = () => {
    if (!navigation) return
    return navigation?.items?.map((item: MenuItemType, i: number) => {
      if (item?.items) {
        return (
          <Suspense key={`${item.key}-${i}`}>
            <NavMenuList menu={item.title}>{renderSubItems(item.items)}</NavMenuList>
          </Suspense>
        )
      }
      return (
        <Button
          key={item.key}
          disableElevation
          onClick={() => {
            resetView()
            if (item.path) navigate(item.path)
          }}
        >
          <Typography fontSize={'14px'} sx={{ textTransform: 'none' }}>
            {item.title}
          </Typography>
        </Button>
      )
    })
  }

  const renderSubItems = (items: any[]) => {
    return items.map((subItem, index) => {
      if (subItem?.items) {
        return (
          <div key={`${subItem.key}-${index}`}>
            <div className="HeadMenuItem">{subItem.title}</div>
            {subItem?.items?.map((subSubItem: MenuItemType, ind: number) => (
              <MenuItem
                className="MenuItem_N2"
                key={`${subSubItem.key}-${ind}`}
                onClick={async () => {
                  if (subSubItem.openAsModal) {
                    let initialValues = {}
                    const values = subSubItem.modalConfig?.initialValues
                    if (subSubItem.modalConfig?.initialValues) {
                      const { oj_data } =
                        (await executeFnc(values.fncName, values.action, values.data)) || {}

                      initialValues = oj_data[0]
                      console.log('initialValues', initialValues)
                    }
                    const dialogId = openDialog({
                      title: subSubItem.title,
                      dialogContent: () =>
                        subSubItem.modalConfig?.config ? (
                          <FrmBaseDialog
                            config={subSubItem.modalConfig.config}
                            initialValues={initialValues}
                          />
                        ) : (
                          <div>No hay configuración disponible</div>
                        ),
                      buttons: [
                        // Botones personalizados del modalConfig (si existen)
                        ...(subSubItem.modalConfig?.customButtons || []).map((button: any) => ({
                          text: button.text,
                          type: button.type,
                          onClick: () => button.onClick(dialogId, closeDialogWithData),
                        })),
                        // Botón cerrar siempre presente
                        {
                          text: 'Cerrar',
                          type: 'cancel',
                          onClick: () => closeDialogWithData(dialogId, {}),
                        },
                      ],
                    })
                  } else {
                    setFiltersLocal([])
                    setViewTypeFromConfig(true)
                    setAditionalFilters([])
                    if (subSubItem.path) navigate(subSubItem.path)
                  }
                }}
              >
                <ListItemText>{subSubItem.title}</ListItemText>
              </MenuItem>
            ))}
          </div>
        )
      }
      return (
        <MenuItem
          key={subItem.key}
          onClick={async () => {
            if (subItem.openAsModal) {
              let initialValues = {}
              const values = subItem.modalConfig?.initialValues
              if (subItem.modalConfig?.initialValues) {
                const { oj_data } =
                  (await executeFnc(values.fncName, values.action, values.data)) || {}

                initialValues = oj_data
                console.log('initialValues', initialValues)
              }
              const dialogId = openDialog({
                title: subItem.title,
                dialogContent: () => (
                  <FrmBaseDialog
                    config={subItem.modalConfig?.config}
                    initialValues={{ orderLines: initialValues }}
                  />
                ),
                buttons: [
                  ...(subItem.modalConfig?.customButtons || []).map((button: any) => ({
                    text: button.text,
                    type: button.type,
                    onClick: () => button.onClick(dialogId, closeDialogWithData),
                  })),
                  {
                    text: 'Cerrar',
                    type: 'cancel',
                    onClick: () => closeDialogWithData(dialogId, {}),
                  },
                ],
              })
            } else {
              setFiltersLocal([])
              setViewTypeFromConfig(true)
              setAditionalFilters([])
              if (subItem.path) {
                navigate(subItem.path)
              }
            }
          }}
        >
          <ListItemText>{subItem.title}</ListItemText>
        </MenuItem>
      )
    })
  }
  return (
    <>
      {navigation ? (
        <>
          <Link
            to={'/'}
            accessKey="h"
            aria-label="Menú de inicio"
            title="Menú de inicio"
            className="o_menu_toggle hasImage"
            onClick={resetView}
          >
            <Icons.Home />
            <img
              className="o_menu_brand_icon d-none d-lg-inline position-absolute start-0 h-100 ps-1 ms-2"
              src={`/images/modules/${module}.png`}
              alt="Ventas"
              height={100}
              width={100}
            />
            <span className="o_menu_brand d-none d-md-flex ms-3 pe-0">{navigation.title}</span>
          </Link>
          {/* <div className="mx-2"> */}
          {/* <div className="hidden md:flex items-center text-sm">{renderNavigationItems()}</div> */}
          <div className="flex">{renderNavigationItems()}</div>
          {/* </div> */}
        </>
      ) : (
        appShowPrevView && (
          <div
            className="ml-3 cursor-pointer"
            onClick={() => {
              setFiltersLocal([])
              setViewTypeFromConfig(true)
              backToPreviousData()
              setAditionalFilters([])
            }}
          >
            <RiArrowRightSLine
              style={{ fontSize: '26px' }}
              className="text-slate-500 hover:text-slate-700"
            />
          </div>
        )
      )}
    </>
  )
}

export default NavBuilder
