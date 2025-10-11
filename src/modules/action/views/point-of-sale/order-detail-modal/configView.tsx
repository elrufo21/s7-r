import { frmElementsProps } from '@/shared/shared.types'
import { useState } from 'react'
import useAppStore from '@/store/app/appStore'
import { DatepickerControlled, MultiSelectObject, SelectControlled } from '@/shared/ui'
import FormRow from '@/shared/components/form/base/FormRow'
import { Chip } from '@mui/material'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import CustomerConfig from '@/modules/contacts/views/contact-index/config'
import ProductConfig from '@/modules/action/views/inventory/products_variant/config'

export function Subtitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700 min-w-[140px]">Fecha de inicio</label>
        <div className="flex-1">
          <DatepickerControlled
            rules={true}
            name="date_start"
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700 min-w-[140px]">Fecha de finalización</label>
        <div className="flex-1">
          <DatepickerControlled
            rules={true}
            name="date_end"
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
      </div>
    </div>
  )
}

export function FrmMiddle({ control, errors, editConfig, watch, setValue }: frmElementsProps) {
  const { createOptions, openDialog, setNewAppDialogs, setFrmIsChanged, closeDialogWithData } =
    useAppStore()
  const [pointsOfSale, setPointsOfSale] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])

  const fnc_renderImps = (value: any, getProps: any) => {
    return value.map((option: any, index: number) => (
      <Chip
        {...getProps({ index })}
        key={index}
        className="text-red-100"
        label={option['label']}
        size="small"
      />
    ))
  }

  // === Loaders ===
  const loadPOS = async () => {
    const pos = await createOptions({ fnc_name: 'fnc_pos_point', action: 's2' })
    setPointsOfSale(pos)
  }
  const loadCustomer = async () => {
    const customers = await createOptions({ fnc_name: 'fnc_partner', action: 's2' })
    setCustomers(customers)
  }
  const loadProducts = async () => {
    const products = await createOptions({ fnc_name: 'fnc_product', action: 's2' })
    setProducts(products)
  }
  const handleSearchContacts = () => {
    let selectedData: any[] = []

    const handlePartnerSelection = (partners: any[], newPartners: any[]) => {
      const existPartnerIds = partners.map((cat: any) => cat.partner_id)

      return newPartners
        .filter((partn) => !existPartnerIds.includes(partn.partner_id))
        .map((partn) => ({
          label: partn.full_name,
          value: partn.partner_id,
          ...partn,
        }))
    }

    const upgradeContacts = (newPartners: any[]) => {
      const actualPartners = watch('partner_id') || []
      const upgradePartners = [
        ...actualPartners,
        ...handlePartnerSelection(actualPartners, newPartners),
      ]

      setValue('partner_id', upgradePartners)
      closeDialogWithData(dialogId, {})
      setFrmIsChanged(true)
    }

    const dialogId = openDialog({
      title: 'Etiquetas de contacto',
      dialogContent: () => (
        <ModalBase
          config={CustomerConfig}
          multiple={true}
          onRowClick={async (option) => {
            if (option.partner_id) {
              upgradeContacts([option])
            }
          }}
          onModalSelectionChange={(_, rowsData) => {
            selectedData = rowsData
          }}
        />
      ),
      buttons: [
        {
          text: 'Seleccionar',
          type: 'confirm',
          onClick: (e: any) => {
            e.preventDefault()
            e.stopPropagation()
            upgradeContacts(selectedData)
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: (e) => {
            e.preventDefault()
            e.stopPropagation()
            setNewAppDialogs([])
          },
        },
      ],
    })
  }

  // === Product Search Modal Logic (ADAPTADO) ===
  const handleSearchProducts = () => {
    let selectedData: any[] = []
    const handleProductSelection = (products: any[], newProducts: any[]) => {
      const existProductIds = products.map((prd: any) => prd.product_id)

      return newProducts
        .filter((prd) => !existProductIds.includes(prd.product_id))
        .map((prd) => ({
          label: prd.name, // 👈 AQUÍ EL CAMBIO
          value: prd.product_id,
          ...prd,
        }))
    }

    const upgradeProducts = (newProducts: any[]) => {
      const actualProducts = watch('product_id') || []
      const upgradeProducts = [
        ...actualProducts,
        ...handleProductSelection(actualProducts, newProducts),
      ]

      setValue('product_id', upgradeProducts)
      closeDialogWithData(dialogId, {})
      setFrmIsChanged(true)
    }

    const dialogId = openDialog({
      title: 'Seleccionar productos',
      dialogContent: () => (
        <ModalBase
          config={ProductConfig}
          multiple={true}
          onRowClick={async (option) => {
            if (option.product_id) {
              upgradeProducts([option])
            }
          }}
          onModalSelectionChange={(_, rowsData) => {
            selectedData = rowsData
          }}
        />
      ),
      buttons: [
        {
          text: 'Seleccionar',
          type: 'confirm',
          onClick: (e: any) => {
            e.preventDefault()
            e.stopPropagation()
            upgradeProducts(selectedData)
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: (e) => {
            e.preventDefault()
            e.stopPropagation()
            setNewAppDialogs([])
          },
        },
      ],
    })
  }

  return (
    <>
      <FormRow label="Punto de venta" fieldName="pos_id" className="w-[500px]">
        <MultiSelectObject
          name="pos_id"
          control={control}
          options={pointsOfSale}
          errors={errors}
          fnc_loadOptions={loadPOS}
          renderTags={fnc_renderImps}
          createOpt={true}
          searchOpt={true}
          editConfig={{ config: editConfig }}
        />
      </FormRow>

      <FormRow label="Tipo" fieldName="type" className="w-[500px]">
        <SelectControlled
          control={control}
          errors={errors}
          name="type"
          options={[
            { label: 'Producto', value: 'P' },
            { label: 'Clientes', value: 'C' },
          ]}
        />
      </FormRow>

      {watch('type') === 'C' && (
        <FormRow label="Cliente" fieldName="partner_id" className="w-[500px]">
          <MultiSelectObject
            name="partner_id"
            control={control}
            options={customers}
            errors={errors}
            fnc_loadOptions={loadCustomer}
            renderTags={fnc_renderImps}
            createOpt={true}
            searchOpt={true}
            editConfig={{ config: editConfig }}
            handleSearchOpt={handleSearchContacts}
          />
        </FormRow>
      )}

      {watch('type') === 'P' && (
        <FormRow label="Producto" fieldName="product_id" className="w-[500px]">
          <MultiSelectObject
            name="product_id"
            control={control}
            options={products}
            errors={errors}
            fnc_loadOptions={loadProducts}
            renderTags={fnc_renderImps}
            createOpt={true}
            searchOpt={true}
            editConfig={{ config: editConfig }}
            handleSearchOpt={handleSearchProducts}
          />
        </FormRow>
      )}
    </>
  )
}
