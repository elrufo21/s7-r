import ModalCompany from '@/modules/action/views/settings/companies/config'
import { AutocompleteControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useEffect, useState } from 'react'
import { ModalBase } from '../modals/ModalBase'

const CompanyField = ({ control, errors, editConfig, setValue, watch, isEdit = false }: any) => {
  const { userCiaEmp, companies } = useUserStore()
  const { formItem, openDialog, setNewAppDialogs, closeDialogWithData, setFrmIsChanged } =
    useAppStore()
  const [company, setCompany] = useState<{ label: string; value: string }[]>([])
  useEffect(() => {
    if (formItem?.['company_id'] || watch('company_id')) {
      setCompany([
        {
          value: watch('company_id') ?? formItem['company_id'],
          label: watch('company_name') ?? formItem['company_name'],
        },
      ])
    }
    if (isEdit) {
      const cp = flattenNodes(userCiaEmp).find((c) => c.company_id === companies[0])
      setCompany([{ label: cp.name, value: cp.company_id }])
      setValue('company_id', cp.company_id)
      setValue('company_name', cp.name)
      setFrmIsChanged(false)
    }
  }, [formItem, userCiaEmp])
  const flattenNodes = (nodes: any[]): any[] => {
    return (nodes ?? []).reduce((acc: any[], node: any) => {
      const flatChildren = node.companies ? flattenNodes(node.companies) : []
      return [
        ...acc,
        { ...node, allChildrenIds: flatChildren.map((c) => c.company_id).join(',') },
        ...flatChildren,
      ]
    }, [])
  }
  const loadCompanies = async () => {
    setCompany(flattenNodes(userCiaEmp).map((c) => ({ label: c.name, value: c.company_id })))
  }
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
  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        <label className="o_form_label">Empresa</label>
      </div>
      <div className="o_cell">
        <div className="o_field">
          <AutocompleteControlled
            name={'company_id'}
            placeholder={'Visible para todos'}
            control={control}
            errors={errors}
            options={company}
            fnc_loadOptions={loadCompanies}
            editConfig={{ config: editConfig }}
            loadMoreResults={fnc_search}
            is_edit={isEdit}
          />
        </div>
      </div>
    </div>
  )
}
export default CompanyField
