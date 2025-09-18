import { useForm } from 'react-hook-form'
import { Tabs } from '@/shared/ui'
import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import { toast } from 'sonner'
import { uploadStringImages } from '@/data/storage/manager_files'
import { ActionTypeEnum, FormActionEnum, ModulesEnum } from '@/shared/shared.types'
import { useNavigate, useParams } from 'react-router-dom'
import useUserStore from '@/store/persist/persistStore'
import { useQueryClient } from '@tanstack/react-query'
import { useActionModule } from '@/shared/hooks/useModule'
import { StatusContactEnum } from './viewTypes.types'
import { getRequiredFieldErrors } from '@/shared/helpers/validators'
import { FrmBarStatus } from '@/shared/components/form/bars/FrmBarStatus'

export const FormView = ({ item }: { item?: any }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    setAppDialog,
    formItem,
    setFrmLoading,
    frmAction,
    setFrmAction,
    frmIsChanged,
    setFrmIsChanged,
    setFrmIsChangedItem,
    frmConfigControls,
    setFrmConfigControls,
    config,
    setDataFormShow,
    dataFormShow,
    setViewType,
    setCanChangeGroupBy,
    breadcrumb,
    setBreadcrumb,
  } = useAppStore((state) => state)

  const {
    frm_bar_buttons,
    frm_bar_status,
    frm_photo,
    frm_top_title,
    frm_star,
    frm_title,
    frm_sub_title,
    frm_middle,
    frm_middle_width,
    frm_middle_right,
    frm_middle_bottom,
    imagenFields,
    tabs,
  } = config.form_inputs

  const { fnc_name, fnc_valid, default_values } = config
  const idRow = config.grid.idRow
  const { filters } = useUserStore()
  const { idAction } = useParams()
  const { mutate: actionModule, isPending } = useActionModule({
    filters,
    module: config.module,
    fncName: config.fnc_name,
    id: idAction || '',
  })
  useEffect(() => {
    setFrmLoading(isPending)
  }, [isPending, setFrmLoading])

  /*  useEffect(() => {
    setFormItem(previousDataBeforeMenu.formItem)
  }, [])*/
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    trigger,

    formState: { errors, isDirty },
  } = useForm<any>({ defaultValues: default_values })

  useEffect(() => {
    if (item) {
      reset(item)
    }
  }, [item, reset])
  useEffect(() => {
    if (!breadcrumb.find((item) => item.title === config.title) && !breadcrumb.length) {
      setBreadcrumb([
        { title: config.title, url: config.module_url, viewType: config.view_default },
      ])
    }
  }, [config.module_url, config.title, config.view_default, breadcrumb, setBreadcrumb])

  const duplicateFunction = async () => {
    if (isPending) return
    const currentForm = { ...watch() }
    const index = dataFormShow.findIndex((elem) => elem[idRow] === Number(id))
    actionModule(
      {
        action: ActionTypeEnum.DUPLICATE,
        filters: [currentForm[idRow]],
        fnc_name,
      },
      {
        onSuccess(res) {
          const newData = [...dataFormShow]
          newData.splice(index + 1, 0, res[0])
          const newFormShow = dataFormShow.length ? newData : [item, res[0]]
          setDataFormShow(newFormShow)
          navigate(
            `${config.module_url.includes(ModulesEnum.ACTION) ? config.item_url : config.module_url}/${res[0][idRow]}`
          )
        },
        onError() {
          toast.error('Error al duplicar el registro.')
        },
      }
    )
  }

  const deleteFunction = async () => {
    if (isPending) return
    const currentForm = { ...watch() }
    const index = dataFormShow.findIndex((elem) => elem[idRow] === Number(id))
    actionModule(
      {
        action: ActionTypeEnum.DELETE,
        filters: [currentForm[idRow]],
        fnc_name,
      },
      {
        onSuccess() {
          if (dataFormShow.length === 1) {
            return navigate(
              config.module_url.includes(ModulesEnum.ACTION) ? config.item_url : config.module_url
            )
          }
          const newData = dataFormShow.filter((elem) => elem[idRow] !== currentForm[idRow])
          const position = index + 1 < dataFormShow.length ? index + 1 : index - 1
          const newId = dataFormShow[position][idRow]
          setDataFormShow(newData)
          navigate(
            `${config.module_url.includes(ModulesEnum.ACTION) ? config.item_url : config.module_url}/${newId}`
          )
        },
        onError(err) {
          console.log(err)
          toast.error('Error al eliminar registro.')
        },
      }
    )

    if (imagenFields.length > 0) {
      for (const field of imagenFields) {
        await eraseImagesByDelete(currentForm, field)
      }
    }
  }

  const dialogChangeStatus = () => {
    const currentForm = { ...watch() }
    const { state } = currentForm

    if (state === StatusContactEnum.ARCHIVE) {
      handleChangeStatus(currentForm)
    }

    if (state === StatusContactEnum.UNARCHIVE) {
      setAppDialog({
        title: 'Confirmación',
        content: '¿Está seguro que desea Archivar este registro?',
        open: true,
        handleConfirm: async () => {
          await handleChangeStatus(currentForm)
        },
        handleCancel: () => {
          //returnStatePrev();
        },
        textConfirm: 'Archivar',
        actions: true,
      })
    }
  }
  const handleChangeStatus = async (currentForm: any) => {
    if (currentForm[idRow]) {
      setValue(
        'state',
        formItem['state'] === StatusContactEnum.UNARCHIVE
          ? StatusContactEnum.ARCHIVE
          : StatusContactEnum.UNARCHIVE
      )
      await saveCore(ActionTypeEnum.UPDATE_STATUS)
    }
  }

  const eraseImagesByDelete = async (currentForm: any, field: string) => {
    const image = currentForm[field]?.[0]?.path || null
    if (image) {
      //const error = await deleteImages(currentForm[field], 'images')
      //if (error) {
      //  if (error.length > 0) {
      //    toast.error('Error al borrar la imagen', { description: JSON.stringify(error) })
      //  }
      //}
    } else {
      console.log('no existe imagen')
    }
  }
  const manageFilesToUpload = async (originForm: any, currentForm: any, field: string) => {
    const obj1 = originForm?.[field]?.[0] ? originForm[field][0] : null
    const obj2 = currentForm?.[field]?.[0] ? currentForm[field][0] : null
    const path1 = obj1?.path || null
    const path2 = obj2?.path || null

    if (path2) return obj1
    if (path1 !== path2) {
      if (obj1?.path) {
        //console.log(obj1)
        //const res = await deleteImages([obj1], 'images')
        //if (res) {
        //  console.log(res)
        //}
      }
    }
    if (obj2?.publicUrl) {
      //subir imagen
      const uniqueName = crypto.randomUUID()
      const res = await uploadStringImages(obj2.publicUrl, 'images', uniqueName)
      if (res) {
        return res
      } else {
        toast.error('Error al subir la imagen')
      }
    }

    return null
  }

  useEffect(() => {
    setCanChangeGroupBy(true)
    setFrmIsChanged(false)
    setFrmIsChangedItem(false)
    return () => {
      console.log('Funcion de guardado en caso exista cambios', frmIsChanged)
      if (frmIsChanged) {
        handleSubmit(() => saveCore())()
      }
    }
  }, [])

  const saveCore = async (actionProp: ActionTypeEnum = ActionTypeEnum.UPDATE) => {
    const currentForm = { ...watch() }
    const validForm = fnc_valid(currentForm, formItem)
    if (validForm) {
      if (imagenFields?.length > 0) {
        for (const field of imagenFields) {
          const res = await manageFilesToUpload(
            currentForm[idRow] ? formItem : null,
            currentForm,
            field
          )
          currentForm[field] = res ? [res] : null
        }
      }

      const action = validForm?.[idRow] ? ActionTypeEnum.UPDATE : ActionTypeEnum.INSERT
      actionModule(
        {
          action: actionProp !== ActionTypeEnum.UPDATE ? actionProp : action,
          filters: validForm,
          fnc_name,
        },
        {
          onSuccess(res) {
            const newData = [...dataFormShow, res].filter(
              (elem) => elem[idRow] && Object.keys(elem).length > 1
            )
            setDataFormShow(newData)
            if (!id) {
              navigate(
                `${config.module_url.includes(ModulesEnum.ACTION) ? config.item_url : config.module_url}/${res[config.grid.idRow]}`
              )
            } else {
              ;(async () => {
                await queryClient.invalidateQueries({ queryKey: [`${config.module}-${id}`] })
                setFrmAction(FormActionEnum.BASE)
              })()
            }
            //toast('registro guardado')
            setFrmIsChanged(false)
            setFrmIsChangedItem(false)
            setFrmAction(FormActionEnum.BASE)
          },
          onError(err) {
            console.log(err)
            toast.error('Error al guardar registro.')
            setFrmAction(FormActionEnum.BASE)
          },
        }
      )
    } else {
      toast.error('Error al validar el formulario')
      setFrmLoading(false)
      setFrmAction(FormActionEnum.BASE)
      return null
    }
  }

  const handleChange = () => {
    setFrmIsChanged(isDirty)
  }

  const queryClient = useQueryClient()
  const executeAction = async (action: FormActionEnum) => {
    let isValid: boolean

    switch (action) {
      case FormActionEnum.PRE_SAVE:
        // Validamos todos los campos primero
        isValid = await trigger()
        // Si el formulario es válido, procedemos con el guardado
        if (isValid) {
          handleSubmit(() => saveCore())()
        } else {
          // Obtener campos faltantes y mostrar toast específico
          const missingFields = getRequiredFieldErrors(errors, config.fieldLabels)

          if (missingFields.length > 0) {
            toast.error(
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-3 text-sm">Campos no válidos:</div>
                  <ul className="space-y-2">
                    {missingFields.map((field, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>,
              {
                duration: 5000,
                closeButton: true,
                className: 'custom-validation-toast',
                style: {
                  background: '#FEFEFE',
                  border: '1px solid #FCA5A5',
                  borderLeft: '4px solid #EF4444',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  minWidth: '300px',
                },
              }
            )
          } else {
            toast.error('Error al validar el formulario')
          }

          setFrmLoading(false)
          setFrmAction(FormActionEnum.BASE)
        }
        break
      case FormActionEnum.SAVE_DRAFT:
        saveCore()
        break
      case FormActionEnum.UPDATE_STATE:
        handleSubmit(dialogChangeStatus)()
        break
      case FormActionEnum.UNDO:
        reset(item)
        ;(async () => {
          await queryClient.invalidateQueries({ queryKey: [`${config.module}-${id}`] })
        })()
        setFrmAction(FormActionEnum.BASE)
        break
      case FormActionEnum.DELETE:
        await deleteFunction()
        if (dataFormShow.length === 1) {
          navigate(config.module_url)
          setViewType(config.view_default)
        }
        setFrmAction(FormActionEnum.BASE)
        break
      case FormActionEnum.REPLICATE:
        duplicateFunction()
        setFrmAction(FormActionEnum.BASE)
        break
      case FormActionEnum.UPDATE_FAVORITE:
        handleSubmit(() => saveCore())()
        break
      default:
        return
    }
  }
  useEffect(() => {
    if (frmAction) {
      executeAction(frmAction)
    }
  }, [frmAction])

  useEffect(() => {
    setFrmIsChanged(isDirty)
  }, [isDirty, setFrmIsChanged])

  useEffect(() => {
    if (!id) setFrmIsChanged(true)
  }, [id, setFrmIsChanged])

  useEffect(() => {
    //setFrmConfigControls(config.configControls)
  }, [config.configControls, setFrmConfigControls])
  return (
    <div className="o_content">
      <div className="o_form_renderer o_form_editable d-flex flex-nowrap h-100 o_form_saved">
        <div
          className={`o_form_sheet_bg ${frm_bar_buttons || frm_bar_status || config.statusBarConfig ? '' : 'pt-[16px]'}`}
          style={{ overflowX: 'hidden' }}
        >
          {(frm_bar_buttons || frm_bar_status || config.statusBarConfig) && (
            <div className="o_form_bar">
              <div className="o_form_bar_buttons">
                {frm_bar_buttons && (
                  <>
                    {frm_bar_buttons({
                      watch,
                      errors,
                      control,
                      setValue,
                      editConfig: frmConfigControls,
                    })}
                  </>
                )}
              </div>

              {(frm_bar_status || config.statusBarConfig) && (
                <div className="o_form_bar_status">
                  <div className="bar_status">
                    {config.statusBarConfig ? (
                      <FrmBarStatus />
                    ) : (
                      frm_bar_status?.({
                        watch,
                        errors,
                        control,
                        setValue,
                        editConfig: frmConfigControls,
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            className={`o_form_sheet position-relative ${frm_bar_buttons || frm_bar_status || config.statusBarConfig ? 'border-top-width-0' : ''}`}
          >
            {(() => {
              const currentState = watch('state')
              const matchingRibbon = config.ribbonList?.find(
                (ribbon) => ribbon.state === currentState
              )

              return matchingRibbon ? (
                <div className={`${matchingRibbon.className}`}>{matchingRibbon.label}</div>
              ) : null
            })()}

            {/* {(frm_bar_buttons || frm_bar_status) && <div className="ribbon-simple">PAGADO</div>} 
            {(frm_bar_buttons || frm_bar_status) && config.fnc_name === 'fnc_account_move' && (
              <div className="ribbon-simple reversed">REVERTIDO</div>
            )}

            <>
              {formItem?.state === 'I' && fnc_name !== 'fnc_payment' && (
                <div className="ribbon">Archivado</div>
              )}
            </>
          */}
            <form onChange={handleChange}>
              {frm_photo &&
                frm_photo({
                  watch,
                  errors,
                  control,
                  setValue,
                  editConfig: frmConfigControls,
                })}
              {frm_title !== undefined && (
                <div className={`oe_title ${frm_top_title !== undefined && 'mb24'}`}>
                  {frm_top_title !== undefined ? (
                    <div className="o_field_widget">
                      {frm_top_title &&
                        frm_top_title({
                          watch,
                          errors,
                          control,
                          setValue,
                          editConfig: frmConfigControls,
                        })}
                    </div>
                  ) : (
                    <div className="o_cell o_wrap_label mb-1">
                      <label className="o_form_label">{config?.formTitle ?? config.dsc}</label>
                    </div>
                  )}

                  <h1>
                    {frm_star !== undefined ? (
                      <div className="d-flex">
                        {frm_star({
                          watch,
                          errors,
                          control,
                          setValue,
                          editConfig: frmConfigControls,
                        })}

                        <div className="o_field_widget o_field_field_fnc_partner_autocomplete text-break">
                          {frm_title &&
                            frm_title({
                              watch,
                              errors,
                              control,
                              setValue,
                              editConfig: frmConfigControls,
                            })}
                        </div>
                      </div>
                    ) : (
                      <div className="o_field_widget o_field_field_fnc_partner_autocomplete text-break">
                        {frm_title &&
                          frm_title({
                            watch,
                            errors,
                            control,
                            setValue,
                            editConfig: frmConfigControls,
                          })}
                      </div>
                    )}
                  </h1>

                  <div className="o_row">
                    <div className="o_field_widget o_field_res_fnc_partner_many2one">
                      {frm_sub_title &&
                        frm_sub_title({
                          watch,
                          errors,
                          control,
                          setValue,
                          editConfig: frmConfigControls,
                        })}
                    </div>
                  </div>
                </div>
              )}

              {(frm_middle || frm_middle_right) && (
                <div className={`o_group ${frm_title !== undefined ? 'mt-2' : ''}`}>
                  {frm_middle && (
                    <div
                      className={`${frm_middle_width !== undefined ? frm_middle_width : 'lg:w-1/2'}`}
                    >
                      <div className="o_inner_group grid">
                        {frm_middle &&
                          frm_middle({
                            watch,
                            errors,
                            control,
                            setValue,
                            editConfig: frmConfigControls,
                          })}
                      </div>
                    </div>
                  )}

                  {frm_middle_right && (
                    <div className="lg:w-1/2">
                      <div className="o_inner_group grid">
                        {frm_middle_right &&
                          frm_middle_right({
                            watch,
                            errors,
                            control,
                            setValue,
                            editConfig: frmConfigControls,
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {frm_middle_bottom && (
                <div className="w-full">
                  {frm_middle_bottom &&
                    frm_middle_bottom({
                      watch,
                      errors,
                      control,
                      setValue,
                      editConfig: frmConfigControls,
                    })}
                </div>
              )}

              {!!tabs && (
                <div className={`w-full ${frm_middle || frm_middle_right ? 'mt-5' : ''}`}>
                  {tabs && (
                    <Tabs
                      list={tabs}
                      watch={watch}
                      control={control}
                      errors={errors}
                      setValue={setValue}
                      editConfig={frmConfigControls}
                      idDialog={0}
                    />
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
        {/* 
        {auditoria && (
          <div className='o-mail-ChatterContainer o-mail-Form-chatter o-aside w-print-100'>
          </div>
        )} */}
      </div>
    </div>
  )
}
