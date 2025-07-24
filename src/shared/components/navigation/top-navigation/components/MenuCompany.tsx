import useUserStore from '@/store/persist/persistStore'
import { Divider, Menu, MenuItem, Tooltip } from '@mui/material'
import { MouseEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CompaniesType } from '../../navigation.types'
import useAppStore from '@/store/app/appStore'

export const MenuCompany = () => {
  const { companies, setCompanies, userData } = useUserStore((state) => state)
  const { defaultCompany, setDefaultCompany, usersEmpSelected, setUsersEmpSelected } = useAppStore(
    (state) => state
  )
  const changeEmpPred = useUserStore((state) => state.changeEmpPred)
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [data, setData] = useState<CompaniesType[]>([])
  const [isChange, setIsChange] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const open = Boolean(anchorEl)
  const { userCiaEmp } = useUserStore()
  const flattenNodes = (nodes: CompaniesType[]): CompaniesType[] => {
    return (nodes ?? []).reduce((acc: CompaniesType[], node: CompaniesType) => {
      const flatChildren = node.companies ? flattenNodes(node.companies) : []
      return [
        ...acc,
        { ...node, allChildrenIds: flatChildren.map((c) => c.company_id).join(',') },
        ...flatChildren,
      ]
    }, [])
  }
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true)
        if (!userData || !userCiaEmp) {
          console.warn('No hay datos de usuario o empresas disponibles')
          return
        }

        const flattenedData = flattenNodes(userCiaEmp)
        const currentEmp = flattenedData.find(
          (item) => item.company_id === (userData.id_pred ?? userData.company_id)
        )
        if (!defaultCompany) {
          setDefaultCompany(currentEmp)
          setUsersEmpSelected([currentEmp])
          setCompanies([currentEmp?.company_id])
        }

        if (usersEmpSelected.length === 0) {
          // Solo rellenamos con la empresa por defecto, no con todas
          if (currentEmp) {
            setUsersEmpSelected([currentEmp])
            setCompanies([currentEmp.company_id])
          }
        }

        const sortedData = flattenedData.sort((a, b) => a.company_id - b.company_id)
        setData(sortedData)
      } catch (error) {
        console.error('Error al inicializar datos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const isSelected = (emp: CompaniesType) => {
    return usersEmpSelected.some((item: CompaniesType) => item.company_id === emp.company_id)
  }
  const handleChange = (emp: CompaniesType) => {
    const empresaTieneHijos = (empresaId: number) => {
      const empresa = data.find((item) => item.company_id === empresaId)
      return empresa?.allChildrenIds
        ? empresa.allChildrenIds.split(',').map((id) => Number(id))
        : []
    }

    const existeEmpresaSeleccionada = usersEmpSelected.some(
      (item: CompaniesType) => item.company_id === emp.company_id
    )

    if (existeEmpresaSeleccionada) {
      if (usersEmpSelected.length < 2) {
        toast.warning('Debe quedar al menos una empresa seleccionada')
        return
      }

      const hijosIds = empresaTieneHijos(emp.company_id)
      const nuevaLista = usersEmpSelected.filter(
        (item: CompaniesType) =>
          !hijosIds.includes(item.company_id) && item.company_id !== emp.company_id
      )

      // Verificar si estamos desmarcando la empresa predeterminada
      if (defaultCompany?.company_id === emp.company_id) {
        // Buscar otra empresa de la lista para establecerla como predeterminada
        if (nuevaLista.length > 0) {
          const nuevaEmpresaPredeterminada = nuevaLista[0]
          setDefaultCompany(nuevaEmpresaPredeterminada)
        }
      }

      setUsersEmpSelected(nuevaLista.length > 0 ? nuevaLista : [emp])
    } else {
      const hijos = empresaTieneHijos(emp.company_id)
        .map((id) => data.find((item) => item.company_id === id))
        .filter(Boolean) as CompaniesType[]

      setUsersEmpSelected([...usersEmpSelected, emp, ...hijos])
    }
    setIsChange(true)
  }

  const changePred = (item: CompaniesType) => {
    setDefaultCompany(item)
    if (!isSelected(item)) setUsersEmpSelected([...usersEmpSelected, item])
    setIsChange(true)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleConfirm = () => {
    if (!defaultCompany?.company_id) {
      toast.error('Debe seleccionar una empresa predeterminada')
      return
    }

    setCompanies(usersEmpSelected.map((item: CompaniesType) => item.company_id))
    changeEmpPred(defaultCompany.company_id)
    setIsChange(false)
    handleClose()
    toast.success('Cambios guardados')
  }
  const handleRedo = () => {
    const empresas = companies
      .map((id: number) => data.find((item) => item.company_id === id))
      .filter((item): item is CompaniesType => item !== undefined)
    setUsersEmpSelected(empresas)

    const currentEmp = empresas.find((item) => item.company_id === userData?.company_id)
    setDefaultCompany(currentEmp)

    setIsChange(false)
    handleClose()
    toast.success('Cambios restaurados')
  }

  const renderMenuItems = (items: any[], level = 0) => {
    return items.map((item) => (
      <div key={item.company_id}>
        <MenuItem
          sx={{
            background:
              defaultCompany?.company_id === item.company_id ? 'rgba(113, 75, 103, 0.2)' : '',
            ...(defaultCompany?.company_id === item.company_id && {
              '&:hover': {
                background: 'rgba(113, 75, 103, 0.3)',
              },
            }),
          }}
        >
          <Tooltip title={item.name}>
            <div className={`flex items-center gap-2 w-full  `}>
              <input
                className="m-1 cursor-pointer"
                type="checkbox"
                checked={isSelected(item)}
                onChange={() => handleChange(item)}
              />
              <Divider orientation="vertical" flexItem />
              <div className="flex items-center" style={{ marginLeft: `${level * 20}px` }}>
                <div
                  onClick={() => changePred(item)}
                  className={`mr-2 truncate w-40 ${isSelected(item) ? 'text-cyan-600' : ''} `}
                >
                  {item.name}
                </div>
              </div>
            </div>
          </Tooltip>
        </MenuItem>
        {Array.isArray(item.companies) && item.companies.length > 0 && (
          <div>{renderMenuItems(item.companies, level + 1)}</div>
        )}
      </div>
    ))
  }
  return (
    <>
      <div className="ls_topbar_company" onClick={handleClick}>
        {isLoading ? (
          <span className="animate-pulse">Cargando...</span>
        ) : (
          defaultCompany?.name || 'Sin empresa seleccionada'
        )}
      </div>
      {!isLoading && userCiaEmp?.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          id="emp-menu"
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          className="mt-2"
        >
          <div className={`max-h-96 overflow-y-auto`}>{renderMenuItems(userCiaEmp)}</div>
          <Divider />
          {isChange && (
            <div className="flex justify-center items-center w-full px-4 mt-2 space-x-4">
              <button className="btn btn-primary w-full sm:w-a/2" onClick={handleConfirm}>
                Confirmar
              </button>
              <button className="btn btn-primary w-full sm:w-a/2" onClick={handleRedo}>
                Restablecer
              </button>
            </div>
          )}
        </Menu>
      )}
    </>
  )
}
