import useAppStore from '@/store/app/appStore'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Tabs } from '@/shared/ui'
import { toast } from 'sonner'
import { uploadStringImages } from '@/data/storage/manager_files'
import { FormConfig, ViewTypeEnum } from '@/shared/shared.types'
import { FrmBarStatus } from '../../form/bars/FrmBarStatus'
import { RibbonRenderer } from '../../form/bars/RibbonRender'

interface FrmBaseDialogProps {
  config: FormConfig
  initialValues?: Record<string, any>
  values?: any
  fnClose?: any
  watch?: any
  idDialog?: any
  onFinish?: (watch: any) => void
  parent_id?: any | null
  setGetData?: any
  viewType?: ViewTypeEnum
}

export const FrmBaseDialog = ({
  config,
  initialValues = {},
  values = null,
  fnClose = null,
  //watch: watchBase,
  idDialog: idDialogBase,
  onFinish,
  //parent_id = null,
  setGetData,
  viewType = ViewTypeEnum.FORM,
}: FrmBaseDialogProps) => {
  const {
    frmConfigControls,
    setFrmConfigControls,
    appDialogsContent,
    setAppDialogsContent,
    //frmDialogItem,
    frmDialogAction,
    setFrmDialogAction,
    setFrmDialogLoading,
    executeFnc,
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
    frm_middle_right,
    frm_middle_bottom,
  } = config.form_inputs

  const [frmDialogState] = useState('n')
  const { setFrmIsChanged } = useAppStore((state) => state)
  const fnc_name = config.fnc_name
  const idRow = config.grid.idRow
  const fnc_valid = config.fnc_valid
  const imagenFields = config.form_inputs?.imagenFields
  const listTabs = config.form_inputs?.tabs
  const defaul_values_config = config.default_values
  const type_config = config.type_config
  const nvalues = { ...(values ? { ...values } : defaul_values_config), ...initialValues }
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: nvalues })
  if (setGetData) setGetData(() => getValues())

  const manageFilesToUpload = async (originForm: any[], currentForm: any[], field: any) => {
    const obj1 = originForm?.[field]?.[0] ? originForm[field][0] : null
    const obj2 = currentForm?.[field]?.[0] ? currentForm[field][0] : null
    const path1 = obj1?.path || null
    const path2 = obj2?.path || null

    if (path2) return obj1
    if (path1 !== path2) {
      if (obj1?.path) {
        /**
         * 
        let res = await deleteImages([obj1], "images");
        if (res) {
          console.log(res);
        }
         */
      }
    }
    if (obj2?.publicUrl) {
      //subir imagen
      let uniqueName = crypto.randomUUID()
      let res = await uploadStringImages(obj2.publicUrl, 'images', uniqueName)
      if (res) {
        return res
      } else {
        toast.error('Error al subir la imagen')
      }
    }

    return null
  }

  const saveCore = async (currentForm: any) => {
    if (currentForm.id !== frmDialogAction.dialog.idDialog) return
    let validForm = fnc_valid(currentForm)
    if (validForm) {
      if (imagenFields?.length > 0) {
        for (const field of imagenFields) {
          let res = await manageFilesToUpload(nvalues, currentForm, field)
          currentForm[field] = res ? [res] : null
        }
      }

      let action = validForm?.[idRow] ? 'u' : 'i'
      let res = await executeFnc(fnc_name, action, validForm)
      frmDialogAction.dialog.afterSave(res.oj_data)
      setFrmDialogAction(null)
      fnClose()
      return {
        validForm,
        res,
        action,
      }
    } else {
      toast.error('Por favor, complete los campos requeridos')
      setFrmDialogLoading(false)
      // No cambiamos el estado de la acción para mantener el formulario tal como está
      return null
    }
  }

  const executeAction = async (action: string) => {
    let isValid: boolean
    switch (action) {
      case 'save': {
        const dialog = appDialogsContent.find((content) => content.idDialog === idDialogBase)
        const withoutId = appDialogsContent.filter((content) => content.idDialog !== idDialogBase)
        setValue('contacts', dialog?.contacts || [])

        // Validamos todos los campos primero
        isValid = await trigger()

        // Si el formulario es válido, procedemos con el guardado
        if (isValid) {
          handleSubmit(saveCore)()
        } else {
          // Si no es válido, solo detenemos la carga
          setFrmDialogLoading(false)
          setFrmDialogAction(null)
          toast.error('Por favor, complete los campos requeridos')
        }

        setAppDialogsContent(withoutId)
        break
      }
      case 'u': {
        const { oj_data } = await executeFnc(config.fnc_name, 'u', watch())
        const { oj_data: data } = await executeFnc(config.fnc_name, 's1', [
          oj_data[config.grid.idRow],
        ])
        reset(data[0])
        setFrmDialogAction(null)
        break
      }
      /**
       * 
      case 'save-temp-branches': {
        if (appDialogs.length < 1) return

        const parentId = parent_id
        const companyId = appDialogs[appDialogs.length - 1].company_id

        const newBranch = {
          ...watch(),
          company_id: companyId,
          action: ActionTypeEnum.INSERT,
          parent_id: parentId,
          level: appDialogs.length + 1,
        }

        const insertBranch = (branches: any[]): any[] =>
          branches.map((branch: any) =>
            branch.company_id === newBranch.company_id
              ? { ...branch, ...newBranch }
              : branch.branches?.length
                ? { ...branch, branches: insertBranch(branch.branches) }
                : branch
          )

        if (appDialogs.length > 1) {
          setFormItem({
            ...formItem,
            branches: insertBranch(formItem?.branches || []),
          })
        } else {
          setFormItem({
            ...watchBase(),
            branches: (formItem?.branches || []).map((branch: any) =>
              branch.company_id === newBranch.company_id
                ? { ...newBranch, branches: branch.branches }
                : branch
            ),
          })
        }

        setFrmDialogAction(null)
        fnClose()
        return
      }
       */

      case 'save-account': {
        if (!watch('number').length) return toast.error('proporcione un numero de cuenta.')
        onFinish?.(watch())
        setFrmIsChanged(true)
        setFrmDialogAction(null)
        fnClose()
        return
      }

      default:
        break
    }
  }

  useEffect(() => {
    setValue('id', idDialogBase)
  }, [])

  useEffect(() => {
    if (config) {
      setFrmConfigControls(config.configControls)
    }
  }, [config])

  useEffect(() => {
    if (frmDialogAction) {
      executeAction(frmDialogAction)
    }
  }, [frmDialogAction])

  return (
    <main className="modal-children">
      <div className="o_form_view o_view_controller">
        <div className="o_form_view_container">
          <div className="o_content">
            <div className="o_form_renderer o_form_editable d-flex flex-column o_form_dirty">
              <div className="o_form_sheet_bg">
                {(frm_bar_buttons || frm_bar_status) && (
                  <>
                    <div className="o_form_bar">
                      <div className="o_form_bar_buttons">
                        {frm_bar_buttons && (
                          <>
                            {frm_bar_buttons({
                              control,
                              errors,
                              editConfig: frmConfigControls,
                              frmState: frmDialogState,
                              watch,
                              setValue,
                            })}
                          </>
                        )}
                      </div>
                      <div className="o_form_bar_status">
                        <div className="bar_status">
                          <FrmBarStatus config={config} watch={watch} control={control} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="o_form_sheet position-relative">
                  {config.ribbonList && <RibbonRenderer config={config.ribbonList} watch={watch} />}

                  <form>
                    {frm_photo &&
                      frm_photo({
                        control,
                        errors,
                        editConfig: frmConfigControls,
                        frmState: frmDialogState,
                        watch,
                        setValue,
                      })}
                    {(frm_top_title !== undefined ||
                      frm_title !== undefined ||
                      frm_sub_title !== undefined) && (
                      <div
                        className={`oe_title ${frm_top_title !== undefined && 'mb-6'} ${frm_photo === undefined && 'no_photo'}`}
                      >
                        {frm_top_title !== undefined ? (
                          <>
                            <div className="o_field_widget">
                              {frm_top_title &&
                                frm_top_title({
                                  control,
                                  errors,
                                  editConfig: frmConfigControls,
                                  frmState: frmDialogState,
                                  watch,
                                  setValue,
                                })}
                            </div>

                            {frm_top_title({
                              control,
                              errors,
                              editConfig: frmConfigControls,
                              frmState: frmDialogState,
                              watch,
                              setValue,
                            }) && <div />}
                          </>
                        ) : (
                          <div className="o_cell o_wrap_label mb-1">
                            <label className="o_form_label">{config.dsc}</label>
                          </div>
                        )}

                        {frm_title !== undefined && (
                          <h1>
                            {frm_star !== undefined ? (
                              <div className="d-flex">
                                {frm_star({
                                  control,
                                  errors,
                                  editConfig: frmConfigControls,
                                  frmState: frmDialogState,
                                  watch,
                                  setValue,
                                })}

                                <div className="o_field_widget o_field_field_fnc_partner_autocomplete text-break">
                                  {frm_title &&
                                    frm_title({
                                      control,
                                      errors,
                                      editConfig: frmConfigControls,
                                      frmState: frmDialogState,
                                      watch,
                                      setValue,
                                    })}
                                </div>
                              </div>
                            ) : (
                              <div className="o_field_widget o_field_field_fnc_partner_autocomplete text-break">
                                {frm_title &&
                                  frm_title({
                                    control,
                                    errors,
                                    editConfig: frmConfigControls,
                                    frmState: frmDialogState,
                                    watch,
                                    setValue,
                                  })}
                              </div>
                            )}
                          </h1>
                        )}

                        {frm_title !== undefined && (
                          <div className="o_row">
                            <div className="o_field_widget o_field_res_fnc_partner_many2one">
                              {frm_sub_title &&
                                frm_sub_title({
                                  control,
                                  errors,
                                  editConfig: frmConfigControls,
                                  frmState: frmDialogState,
                                  watch,
                                  setValue,
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {(frm_middle || frm_middle_right) && (
                      <div className={`o_group ${frm_title !== undefined ? 'mt-4' : ''}`}>
                        {viewType === ViewTypeEnum.LIBRE ? (
                          <div className="">
                            {frm_middle &&
                              frm_middle({
                                control,
                                errors,
                                editConfig: frmConfigControls,
                                frmState: frmDialogState,
                                watch,
                                setValue,
                              })}
                          </div>
                        ) : (
                          <>
                            <div className="lg:w-1/2">
                              <div className="o_inner_group grid">
                                {frm_middle &&
                                  frm_middle({
                                    control,
                                    errors,
                                    editConfig: frmConfigControls,
                                    frmState: frmDialogState,
                                    watch,
                                    setValue,
                                  })}
                              </div>
                            </div>
                            <div className="lg:w-1/2">
                              <div className="o_inner_group grid">
                                {frm_middle_right &&
                                  frm_middle_right({
                                    control,
                                    errors,
                                    editConfig: frmConfigControls,
                                    frmState: frmDialogState,
                                    watch,
                                    setValue,
                                  })}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {frm_middle_bottom && (
                      <div className="w-full">
                        {frm_middle_bottom &&
                          frm_middle_bottom({
                            control,
                            errors,
                            editConfig: frmConfigControls,
                            frmState: frmDialogState,
                            watch,
                            setValue,
                          })}
                      </div>
                    )}
                    <div className={`w-full ${frm_middle || frm_middle_right ? 'mt-5' : ''}`}>
                      {listTabs && (
                        <Tabs
                          list={listTabs}
                          watch={watch}
                          control={control}
                          errors={errors}
                          setValue={setValue}
                          editConfig={frmConfigControls}
                          frmState={frmDialogState}
                          type_config={type_config}
                          idDialog={idDialogBase}
                        />
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
