import { Filter, useAutocompleteField } from '@/shared/components/form/hooks/useAutocompleteField'
import { AutocompleteControlled } from '@/shared/ui/inputs/AutocompleteControlled'
import { ActionTypeEnum, ViewTypeEnum } from '@/shared/shared.types'
import { useNavigate, useLocation } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { FrmBaseDialog } from '@/shared/components/core/Dialog/FrmBaseDialog'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { required } from '@/shared/helpers/validators'

// Configuración para hacer el componente reutilizable
interface BaseConfig {
  // Configuración de la entidad (siempre requerida)
  fncName: string // 'fnc_partner', 'fnc_product', etc.
  primaryKey: string // 'partner_id', 'product_id', etc.

  // Configuración opcional de la entidad
  modalTitle?: string // 'Contacto', 'Producto', 'Usuario'

  // Configuración de navegación (opcional)
  basePath?: string // '/contacts', '/products', '/users'

  // Configuración de modal (opcional)
  modalConfig?: any

  // Configuración de campos opcionales
  relatedFields?: { [key: string]: string } // campos adicionales a setear

  // Configuración de validación de datos específica (opcional)
  dataProcessor?: (data: any) => any

  // Mensajes personalizados (opcional)
  messages?: {
    createError?: string
    createSuccess?: string
  }

  // Solo requerido si allowCreateAndEdit es true o se usa crear
  createDataBuilder?: (data: any) => Record<string, any>

  // Botones personalizados (opcional)
  buttons?: Array<{ text: string; type: string; onClick: () => void }>

  // Solo requerido si allowCreateAndEdit es true
  onCreateAndEditSave?: (
    getData: () => any,
    helpers: { close: () => void },
    reloadOptions: () => void
  ) => Promise<void>
}

interface BaseAutocompleteProps {
  control: any
  errors: any
  setValue: any
  formItem: any
  editConfig: any
  placeholder?: string
  name: string
  label: string
  rulers?: boolean
  filters?: Filter[]
  allowCreateAndEdit?: boolean
  allowSearchMore?: boolean
  config: BaseConfig
  // Nueva propiedad para controlar navegación en modo no editable
  allowNavigationWhenNotEditable?: boolean
  draftLabel?: string // Etiqueta para borradores, si aplica
  disableFrmIsChanged?: boolean
  className?: string
}

const BaseAutocomplete = ({
  control,
  errors,
  setValue,
  formItem,
  editConfig,
  placeholder,
  name,
  label,
  rulers = false,
  filters = [],
  config,
  allowCreateAndEdit = false,
  allowSearchMore = false,
  allowNavigationWhenNotEditable = false, // Nueva prop
  disableFrmIsChanged = false,
  className = '',
}: BaseAutocompleteProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    openDialog,
    closeDialogWithData,
    //setNewAppDialogs,
    setFrmIsChanged,
    breadcrumb,
    setBreadcrumb,
    frmCreater,
    executeFnc,
    setFrmIsChangedItem,
    activateVirtualKeyboard,
  } = useAppStore()

  // Usar el hook para manejar el campo de autocompletado
  const { options, loadOptions, reloadOptions } = useAutocompleteField({
    fncName: config.fncName,
    idField: name,
    nameField: label,
    formItem,
    filters: filters,
  })

  const fncEnlace = (value: string) => {
    // Solo navegar si basePath está definido
    if (config.basePath) {
      navigate(`${config.basePath}/${value}`)
      setBreadcrumb([
        ...breadcrumb,
        {
          title: formItem?.name,
          url: pathname,
          viewType: ViewTypeEnum.FORM,
        },
      ])
    }
  }

  const fnc_create = async (value: string) => {
    // Solo crear si createDataBuilder está definido
    if (config.createDataBuilder) {
      const createData = config.createDataBuilder(value)

      await frmCreater(config.fncName, createData, config.primaryKey, async (res: string) => {
        await reloadOptions()
        setValue(name, res)
      })
    }
  }

  const fnc_create_edit = async (data: string) => {
    // Solo permitir crear y editar si modalConfig está definido
    if (!config.modalConfig) {
      console.warn('modalConfig es requerido para crear y editar')
      return
    }

    let getData = () => ({})
    const dialogId = openDialog({
      title: config.modalTitle || 'Crear/Editar',
      dialogContent: () => (
        <FrmBaseDialog
          config={config.modalConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ name: data }}
          idDialog={dialogId}
        />
      ),

      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            if (typeof config.onCreateAndEditSave === 'function') {
              setFrmIsChangedItem(true)
              await config.onCreateAndEditSave(
                getData,
                {
                  close: () => closeDialogWithData(dialogId, getData()),
                },
                reloadOptions
              )
            } else {
              const formData = getData()
              const res = await executeFnc(config.fncName, ActionTypeEnum.INSERT, formData)
              setValue(name, res.oj_data[config.primaryKey])
              setValue(label, res.oj_data[label])
              reloadOptions()
              setFrmIsChangedItem(true)
              closeDialogWithData(dialogId, res.oj_data)
            }
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

  const fnc_search = () => {
    if (!config.modalConfig) {
      console.warn('modalConfig es requerido para búsqueda avanzada')
      return
    }

    const dialogId = openDialog({
      title: config.modalTitle || 'Buscar',
      dialogContent: () => (
        <ModalBase
          config={config.modalConfig}
          multiple={false}
          onRowClick={async (option) => {
            setValue(name, option[config.primaryKey])
            if (disableFrmIsChanged === false) setFrmIsChanged(true)
            closeDialogWithData(dialogId, {})
            //clouseDialog()setNewAppDialogs([])
          }}
          defaultFiters={filters}
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

  // Determinar si se debe mostrar el enlace de navegación
  const shouldShowNavigationLink = () => {
    // Si no hay basePath, nunca mostrar enlace
    if (!config.basePath) return false

    // Si está en modo editable, siempre mostrar enlace (comportamiento original)
    const isEditable = !(editConfig?.config?.[name]?.isEdit || false)
    if (isEditable) return true

    // Si no es editable, solo mostrar si allowNavigationWhenNotEditable es true
    return allowNavigationWhenNotEditable
  }

  return (
    <AutocompleteControlled
      name={name}
      control={control}
      errors={errors}
      options={options}
      fnc_loadOptions={loadOptions}
      loadMoreResults={allowSearchMore ? fnc_search : undefined}
      createItem={config.createDataBuilder ? fnc_create : undefined}
      createAndEditItem={allowCreateAndEdit ? fnc_create_edit : undefined}
      editConfig={{ config: editConfig }}
      placeholder={placeholder}
      fnc_enlace={shouldShowNavigationLink() ? fncEnlace : undefined}
      rules={rulers ? required() : {}}
      disableFrmIsChanged={disableFrmIsChanged}
      className={className}
      enableVirtualKeyboard={activateVirtualKeyboard}
      // useNumericKeyboard
      // isInsideModal
    />
  )
}

export default BaseAutocomplete
