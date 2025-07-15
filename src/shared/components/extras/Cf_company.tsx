import { useCallback, useEffect, useMemo, useState } from 'react'
import ModalCompany from '@/modules/action/views/settings/companies/config'

import { useLocation, useNavigate } from 'react-router-dom'
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'
import useUserStore from '@/store/persist/persistStore'
import useAppStore from '@/store/app/appStore'
import FormRow from '../form/base/FormRow'
import { AutocompleteControlled } from '@/shared/ui'
import { ModalBase } from '../modals/ModalBase'
import { required } from '@/shared/helpers/validators'
import { ViewTypeEnum } from '@/shared/shared.types'
import { FrmBaseDialog } from '../core'

interface Company {
  company_id: string
  name: string
  companies?: Company[]
}

interface CompanyOption {
  label: string
  value: string
}

interface CfCompanyProps {
  label: string
  control: Control<any>
  errors: FieldErrors
  editConfig?: any
  setValue: UseFormSetValue<any>
  idField?: string
  nameField?: string
  isEdit?: boolean
  defCompany?: boolean
  rules?: boolean
  navigate?: boolean
  name?: string
  create?: boolean
  createAndEdit?: boolean
  watch?: any
}

const CfCompany = ({
  label,
  control,
  errors,
  editConfig,
  setValue,
  idField = 'company_id',
  nameField = 'company_name',
  isEdit = true,
  defCompany = true,
  rules = false,
  navigate = false,
  name = '',
  createAndEdit = false,
  watch,
}: CfCompanyProps) => {
  const { pathname } = useLocation()
  const [companiesData, setCompanies] = useState<CompanyOption[]>([])
  const [defaultSet, setDefaultSet] = useState(false) // Nuevo estado para controlar si ya se estableció el default
  const {
    setFrmConfigControls,
    defaultCompany,
    formItem,
    openDialog,
    setNewAppDialogs,
    closeDialogWithData,
    setBreadcrumb,
    breadcrumb,
  } = useAppStore()
  const { userCiaEmp } = useUserStore()
  const navigateFnc = useNavigate()

  // Función para aplanar la estructura jerárquica de empresas
  const flattenNodes = useCallback((nodes: Company[]): Company[] => {
    if (!nodes || !Array.isArray(nodes)) return []

    return nodes.reduce<Company[]>((acc, node) => {
      const flatChildren = node.companies ? flattenNodes(node.companies) : []
      return [
        ...acc,
        {
          ...node,
          allChildrenIds: flatChildren.map((c) => c.company_id).join(','),
        },
        ...flatChildren,
      ]
    }, [])
  }, [])

  // Memorizar las opciones de empresas para evitar recálculos innecesarios
  const companyOptions = useMemo(() => {
    if (!userCiaEmp) return []

    return flattenNodes(userCiaEmp).map((company) => ({
      label: company.name,
      value: company.company_id,
    }))
  }, [userCiaEmp, flattenNodes])

  const loadCompanies = useCallback(async () => {}, [])

  const isNewMode = useMemo(() => pathname.includes('new'), [pathname])

  // Efecto para cargar las opciones de empresas
  useEffect(() => {
    setCompanies(companyOptions)
  }, [companyOptions])

  // Efecto para configurar controles del formulario
  useEffect(() => {
    setFrmConfigControls({
      [idField]: {
        isEdit,
      },
    })
  }, [idField, isEdit, setFrmConfigControls])

  useEffect(() => {
    if (
      defCompany &&
      isNewMode &&
      defaultCompany?.company_id &&
      companyOptions.length > 0 &&
      !defaultSet
    ) {
      const defaultExists = companyOptions.some(
        (option) => option.value === defaultCompany.company_id
      )

      if (defaultExists) {
        setValue(idField, defaultCompany.company_id)
        if (defaultCompany.name) {
          setValue(nameField, defaultCompany.name)
        }
        setDefaultSet(true)
      }
    }
  }, [
    defCompany,
    isNewMode,
    defaultCompany,
    companyOptions,
    defaultSet,
    setValue,
    idField,
    nameField,
    formItem,
    watch(),
  ])

  useEffect(() => {
    setDefaultSet(false)
  }, [pathname, formItem])

  const fnc_search = async () => {
    const dialogId = openDialog({
      title: 'Buscar: Empresa',
      dialogContent: () => (
        <ModalBase
          config={ModalCompany}
          multiple={false}
          onRowClick={async (option) => {
            if (option.partner_id) {
              setValue('company_id', option.company_id)
            }
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  const fnc_navigate = () => {
    setBreadcrumb([
      ...breadcrumb,
      {
        title: name,
        url: pathname,
        viewType: ViewTypeEnum.FORM,
      },
    ])
    navigateFnc(`/action/4/detail/${formItem?.company_id || ''}`)
  }

  const fnc_createEdit = async (option: any) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear empresa',
      dialogContent: () => (
        <FrmBaseDialog
          config={ModalCompany}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ name: option || '' }}
          idDialog={dialogId}
        />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            //const formData = getData()
            // const res = await executeFnc('company', 'i', formData)
            // const id = res.oj_data[]
            closeDialogWithData(dialogId, getData())
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }
  return (
    <FormRow label={label}>
      <AutocompleteControlled
        name={idField}
        placeholder="Visible para todos"
        control={control}
        errors={errors}
        options={companiesData}
        fnc_loadOptions={loadCompanies}
        editConfig={editConfig}
        loadMoreResults={fnc_search}
        rules={rules ? { required: required() } : {}}
        fnc_enlace={navigate ? fnc_navigate : undefined}
        createAndEditItem={createAndEdit ? fnc_createEdit : undefined}
      />
    </FormRow>
  )
}

export default CfCompany
