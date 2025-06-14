import { useEffect, useState } from 'react'
import useAppStore from '@/store/app/appStore'
import { AutocompleteControlled, TextControlled, ImageInput } from '@/shared/ui'
import { frmElementsProps } from '@/shared/shared.types'

export function FrmPhoto({ watch, setValue, control, editConfig }: frmElementsProps) {
  return (
    <div className="o_field_widget o_field_image oe_avatar">
      <ImageInput
        watch={watch}
        setValue={setValue}
        name={'files'}
        control={control}
        editConfig={{ config: editConfig }}
      />
    </div>
  )
}

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={'Por ejemplo, televisores'}
      multiline={true}
      control={control}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmMiddle({ control, errors }: frmElementsProps) {
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)
  const [Categorias, setCategorias] = useState<{ label: string; value: string }[]>([])

  const cargaData = async () => {
    setCategorias(
      await createOptions({
        fnc_name: 'fnc_product_pos_category',
        action: 's2',
      })
    )
  }

  useEffect(() => {
    if (formItem?.['parent_id']) {
      setCategorias([
        {
          label: formItem['parent_name'],
          value: formItem['parent_id'],
        },
      ])
    }
  }, [formItem])

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Categoría principal</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'parent_id'}
              placeholder={''}
              control={control}
              errors={errors}
              options={Categorias}
              fnc_loadOptions={cargaData}
              //fnc_enlace={fnc_enlace}
            />
          </div>
        </div>
      </div>
    </>
  )
}
