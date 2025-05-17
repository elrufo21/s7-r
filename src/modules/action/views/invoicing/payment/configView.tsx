import { frmElementsProps } from '@/shared/shared.types'
import {
  AutocompleteControlled,
  DatepickerControlled,
  RadioButtonControlled,
  TextControlled,
} from '@/shared/ui'

export const FrmTittle = () => {
  return (
    <h1 className="text-2xl font-bold text-gray-900">
      <span>BORRADOR</span>
    </h1>
  )
}
export const FrmMiddle = ({ control, errors, editConfig = {} }: frmElementsProps) => {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label flex align-items-center ">
          <label className="o_form_label">Tipo de producto</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <div className="w-full flex">
              <RadioButtonControlled
                name={'type'}
                control={control}
                rules={{}}
                options={[
                  { value: 'S', label: 'Enviar' },
                  { value: 'R', label: 'Recibir' },
                ]}
                editConfig={{ config: editConfig }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Cliente</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'name'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              options={[]}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Importe</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Fecha</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <DatepickerControlled
              name={'name'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              rules={{}}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export const FrmMiddleRight = ({ control, errors, editConfig }: frmElementsProps) => {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Metodo de pago</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'name'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              options={[]}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Cuenta bancaria de la empresa</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'name'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              options={[]}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  )
}
