import { useEffect, useState } from 'react'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { frmElementsProps } from '@/shared/shared.types'
import { useLocation, useNavigate } from 'react-router-dom'

const required = {
  required: { value: true, message: 'Este campo es requerido' },
}

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  //const searchParams = useSearchParams();
  const { setBreadcrumb, breadcrumb, createOptions, config, formItem } = useAppStore()
  const [uom, setUom] = useState<{ value: string; label: string }[]>([])
  /** 
   * 
  const [Cets, setCets] = useState<{ value: string; label: string }[]>([])
  const cargaData_Cets = async () => {
    setCets(
      await createOptions({
        fnc_name: 'fnc_partner_category',
        filters: [],
        action: 's2',
      })
    )
  }
   */

  const fnc_enlace = (value: number) => {
    setBreadcrumb([
      ...breadcrumb,
      {
        title: formItem.name,
        url: pathname,
        viewType: config.view_default,
      },
    ])
    navigate(`/action/91/detail/${value}`)
  }

  useEffect(() => {
    if (formItem?.['parent_id']) {
      setUom([
        {
          label: formItem['parent_name'],
          value: formItem['parent_id'],
        },
      ])
    }
  }, [formItem])

  const loadDataCategory = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_uom',
      filters: [{ column: 'state', value: 'A' }],
      action: 's2',
    })
    setUom(options)
  }

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre de la unidad</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              placeholder={'por ejemplo, "Unidades"'}
              control={control}
              rules={required}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      {!pathname.includes('/new') && (
        <div className="d-sm-contents">
          <div className="o_cell o_wrap_label">
            <label className="o_form_label">Measure unit code</label>
          </div>
          <div className="o_cell">
            <div className="o_field">
              <TextControlled
                name={'uom_code'}
                control={control}
                errors={errors}
                editConfig={{ config: editConfig }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Cantidad</label>
        </div>
        <div className="o_cell">
          <div className="o_field  ">
            <div className="w-full flex">
              <div className="w-1/4">
                <TextControlled
                  name={'factor'}
                  placeholder={''}
                  control={control}
                  rules={required}
                  errors={errors}
                  editConfig={{ config: editConfig }}
                />
              </div>
              <div className="w-1/3">
                <AutocompleteControlled
                  name={'parent_id'}
                  placeholder={'Unidad de referencia'}
                  control={control}
                  errors={errors}
                  options={uom}
                  fnc_loadOptions={loadDataCategory}
                  enlace={true}
                  fnc_enlace={fnc_enlace}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Categoría de UNSPSC</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'unspsc_code_id'}
              placeholder={''}
              control={control}
              errors={errors}
              options={[]}
              //fnc_loadOptions={cargaData_Cets}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  )
}
