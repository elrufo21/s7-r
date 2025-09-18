import { FaRegMoneyBill1 } from 'react-icons/fa6'
import { FaTruck } from 'react-icons/fa'
import { ContactOptionEnum } from '@/modules/contacts/contacts.types'

interface ContactImageProps {
  contactItem: any
}

export const ContactImage = ({ contactItem }: ContactImageProps) => {
  const srcImg = () =>
    contactItem?.files ? contactItem.files[0].publicUrl : '/images/no-avatar.png'

  if (!contactItem?.files) {
    if (contactItem.address_type === ContactOptionEnum.BILLING_ADDRESS) {
      return (
        <div className="h-24 w-24 flex justify-center items-center">
          <FaRegMoneyBill1 size={50} color="#714b67" />
        </div>
      )
    }
    if (contactItem.address_type === ContactOptionEnum.DELIVERY_ADDRESS) {
      return (
        <div className="h-24 w-24 flex justify-center items-center">
          <FaTruck size={50} color="#714b67" />
        </div>
      )
    }
  }

  return (
    <img src={srcImg()} alt="no-avatar" width={100} height={100} className="max-h-20 max-w-20" />
  )
}
