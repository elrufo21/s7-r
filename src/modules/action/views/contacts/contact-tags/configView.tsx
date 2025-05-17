import { useEffect, useRef, useState } from 'react'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import Stack from '@mui/material/Stack'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { Controller } from 'react-hook-form'
import { frmElementsProps } from '@/shared/shared.types'
import { listTagColors } from '@/shared/constants'

const required = {
  required: { value: true, message: 'Este campo es requerido' },
}

export const ColorOptions = [
  { label: 'Sin color', value: 0 },
  { label: 'Rojo', value: 1 },
  { label: 'Naranja', value: 2 },
  { label: 'Amarillo', value: 3 },
  { label: 'Cian', value: 4 },
  { label: 'Morado', value: 5 },
  { label: 'Almendra', value: 6 },
  { label: 'Turquesa', value: 7 },
  { label: 'Azul', value: 8 },
  { label: 'Frambuesa', value: 9 },
  { label: 'Verde', value: 10 },
  { label: 'Violeta', value: 11 },
]

export function FrmMiddle({ setValue, control, errors, editConfig }: frmElementsProps) {
  //const searchParams = useSearchParams();
  const createOptions = useAppStore((state) => state.createOptions)
  const formItem = useAppStore((state) => state.formItem)

  const [Cets, setCets] = useState<{ value: string; label: string }[]>([])
  const cargaData_Cets = async () => {
    setCets(
      await createOptions({
        fnc_name: 'fnc_partner_category',
        action: 's2',
      })
    )
  }

  const fnc_enlace = () => {}

  useEffect(() => {
    if (formItem?.['parent_id']) {
      setCets([
        {
          label: formItem['parent_name'],
          value: formItem['parent_id'],
        },
      ])
    }
  }, [formItem])

  const [openPopup, setOpenPopup] = useState(false)
  const [color, setColor] = useState(0)
  const colorOptionsRef = useRef(null)

  const fn_click2 = () => {
    setOpenPopup(!openPopup)
  }

  const fn_click3 = (color: number, field: any) => {
    console.log('entraaa', listTagColors[color])
    setValue('color', listTagColors[color])
    field.onChange(color)
    setColor(color)
    setOpenPopup(!openPopup)
  }

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpenPopup(false)
    }
  }

  const handleBlur = () => {
    if (openPopup) {
      setOpenPopup(false)
    }
  }

  useEffect(() => {
    if (formItem) {
      setColor(formItem['color'])
    }
  }, [formItem])

  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre de label</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              placeholder={'por ejemplo, "servicios de consultoría"'}
              control={control}
              rules={required}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Color</label>
        </div>
        <div className="o_cell">
          <div className="o_field flex ">
            <Controller
              name="color"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <Stack hidden={openPopup}>
                      <div className="o_colorlist d-flex flex-wrap align-items-center mw-100 gap-2 mr-2">
                        <button
                          type="button"
                          className={`btn p-0 rounded-0 o_colorlist_toggler o_colorlist_item_color_${field.value}`}
                          onClick={fn_click2}
                        />
                      </div>
                    </Stack>
                    {openPopup && (
                      <ClickAwayListener onClickAway={handleBlur}>
                        <Stack hidden={!openPopup}>
                          <div
                            ref={colorOptionsRef}
                            className="o_colorlist d-flex flex-wrap align-items-center mw-100 gap-2"
                          >
                            {ColorOptions.map((option, index) => {
                              return (
                                <button
                                  key={option.value}
                                  onClick={() => fn_click3(option.value, field)}
                                  type="button"
                                  tabIndex={index}
                                  title={option.label}
                                  className={`btn p-0 rounded-0 o_colorlist_item_color_${
                                    option.value
                                  } ${color === option.value && 'o_colorlist_selected'}`}
                                ></button>
                              )
                            })}
                          </div>
                        </Stack>
                      </ClickAwayListener>
                    )}
                  </>
                )
              }}
            />
          </div>
        </div>
      </div>
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
              options={Cets}
              fnc_loadOptions={cargaData_Cets}
              enlace={true}
              fnc_enlace={fnc_enlace}
            />
          </div>
        </div>
      </div>
    </>
  )
}
