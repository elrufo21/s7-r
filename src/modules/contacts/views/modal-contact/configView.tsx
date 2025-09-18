import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import { InputWithLabel, RadioButtonControlled, TextControlled } from '@/shared/ui'
import { frmElementsProps } from '@/shared/shared.types'
import AddressField from '@/shared/components/extras/AddressField'
import { required } from '@/shared/helpers/validators'
interface TopTitleProps {
  control: any
  editConfig: any
  frmState: any
  options: any
}

export function Frm_Top_Title({ control, editConfig, options }: TopTitleProps) {
  return (
    <RadioButtonControlled
      name={'address_type'}
      control={control}
      options={options}
      rules={{}}
      editConfig={{ config: editConfig }}
    />
  )
}

export function Frm_Middle_Left({
  setValue,
  watch,
  control,
  errors,
  editConfig,
}: frmElementsProps) {
  // const createOptions = useAppStore((state) => state.createOptions)
  // const formItem = useAppStore((state) => state.formItem)
  // const appDialogsContent = useAppStore((state) => state.appDialogsContent)
  const frmDialogItem = useAppStore((state) => state.frmDialogItem)

  // const [Ctis, setCtis] = useState<{ label: string; value: string }[]>([])
  // const cargaData_Ctis = async () => {
  //   setCtis(
  //     await createOptions({
  //       fnc_name: 'fnc_cia_ct_cti',
  //     })
  //   )
  // }

  const cargaData = () => {
    // const listContact =
    //   appDialogsContent.length > 0 ? appDialogsContent : formItem.list_contacts || []
    // const [frmSelected] = listContact.filter(
    //   (contact: any) => contact.partner_id === frmDialogItem.id
    // )
    // if (frmSelected && frmSelected['title_id']) {
    //   setCtis([
    //     {
    //       value: frmSelected['title_id'],
    //       label: frmSelected['title_name'],
    //     },
    //   ])
    // }
  }

  useEffect(() => {
    if (frmDialogItem) {
      cargaData()
    }
  }, [frmDialogItem])

  // const handleChange = (data: any, dsc: string) => {
  //   console.log(dsc, data[dsc])
  //   setValue(dsc, data[dsc])
  // }

  return (
    <>
      <InputWithLabel
        control={control}
        editConfig={{ config: editConfig }}
        errors={errors}
        label={'Nombre'}
        name={'name'}
        placeholder={'por ejemplo, Nueva dirección'}
        rules={required()}
      />
      {watch('address_type') === 'CO' ? (
        <>
          {/*
          <div className="d-sm-contents">
            <div className="o_cell o_wrap_label">
              <label className="o_form_label">Título</label>
            </div>
            <div className="o_cell">
              <div className="o_field">
                <AutocompleteControlled
                  name={'title_id'}
                  placeholder={'por ejemplo, Señor'}
                  handleOnChanged={(data) => handleChange(data, 'title_name')}
                  control={control}
                  errors={errors}
                  options={Ctis}
                  fnc_loadOptions={cargaData_Ctis}
                  editConfig={{ config: editConfig }}
                />
              </div>
            </div>
          </div>
          */}

          <InputWithLabel
            control={control}
            editConfig={{ config: editConfig }}
            errors={errors}
            label={'Puesto de trabajo'}
            name={'workstation'}
            placeholder={'por ejemplo, director de ventas'}
          />
        </>
      ) : (
        <>
          <div className="d-sm-contents">
            <label className="o_form_label">Dirección</label>
            <AddressField
              control={control}
              errors={errors}
              editConfig={editConfig}
              setValue={setValue}
              watch={watch}
            />
          </div>
        </>
      )}
    </>
  )
}

export function Frm_Middle_Right({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <InputWithLabel
        control={control}
        editConfig={{ config: editConfig }}
        errors={errors}
        label={'Correo electrónico'}
        name={'email'}
        placeholder={'example@gmail.com'}
      />
      <InputWithLabel
        control={control}
        editConfig={{ config: editConfig }}
        errors={errors}
        label={'Teléfono'}
        name={'phone'}
      />
      {/*
      <InputWithLabel
        control={control}
        editConfig={{ config: editConfig }}
        errors={errors}
        label={'Celular'}
        name={'mobile'}
      />
      */}
    </>
  )
}

export function Frm_Middle_Bottom({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="w-full mt-5">
      <TextControlled
        name={'internal_notes'}
        control={control}
        errors={errors}
        multiline={true}
        className={'InputNoLineEx w-full'}
        placeholder={'Notas internas ...'}
        editConfig={{ config: editConfig }}
      />
    </div>
  )
}
