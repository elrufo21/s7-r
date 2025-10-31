import { Chip } from '@mui/material'
import { BsBuildings } from 'react-icons/bs'
import { LuUser } from 'react-icons/lu'
import { RiTimeLine } from 'react-icons/ri'
import { FaRegMoneyBill1 } from 'react-icons/fa6'
import { FaRegStar, FaStar, FaTruck } from 'react-icons/fa'
import { ContactOptionEnum } from '@/modules/contacts/contacts.types'
import { StatusContactEnum } from '@/shared/components/view-types/viewTypes.types'
import useAppStore from '@/store/app/appStore'
import Kanbanchart from './kanban-chart'

interface KanbanBoxProps {
  item: any
  fnc(item: any, i: number): void
  index: number
  fnc_name: string
}

export const KanbanBox = ({ item, fnc, index, fnc_name }: KanbanBoxProps) => {
  const { changeFavoriteId, setChangeFavoriteId } = useAppStore()
  if (item === undefined) return <></>

  const image = item?.['files'] ? item?.['files'] : null
  const uri = image ? image?.[0]?.publicUrl : null
  return (
    <div
      role="article"
      className="o_kanban_record d-flex flex-grow-1 flex-md-shrink-1 flex-shrink-0"
    >
      <div onClick={() => fnc(item, index)} className="oe_kanban_card oe_kanban_global_click flex">
        {item.state === StatusContactEnum.ARCHIVE && (
          <div className="ribbon_card">
            <span>Archivado</span>
          </div>
        )}
        {fnc_name === 'fnc_fac_ts_doc' && (
          <div className="oe_kanban_details">
            <div className="flex flex-row font-bold mb-1">
              <div className="basis-1/2">{item.kb__dsc_1 ?? ''}</div>
              <div className="basis-1/2 flex justify-end">
                <RiTimeLine style={{ fontSize: '15px', marginTop: '3px', marginRight: '4px' }} />
                17/07/2024
              </div>
            </div>

            <div className="flex flex-row">
              <div className="basis-1/2">S/. 100.18</div>
              <div className="basis-1/2 text-end">Publicado</div>
            </div>
          </div>
        )}
        {fnc_name === 'fnc_partner' && (
          <>
            <div className="c_imageEx_64 self-center">
              {uri ? (
                <img
                  src={uri}
                  alt="image contact"
                  width={200}
                  height={200}
                  className="object-cover object-center imageEx_64"
                />
              ) : (
                <div className="imageEx_64">
                  <div className="flex justify-center items-center w-full h-full ">
                    {item.address_type === null ? (
                      <>
                        {item['type'] === 'I' ? (
                          <LuUser className=" w-14 h-14 text-gray-400" />
                        ) : (
                          <BsBuildings className=" w-14 h-14 text-gray-400" />
                        )}
                      </>
                    ) : (
                      <>
                        {item.address_type === ContactOptionEnum.BILLING_ADDRESS && (
                          <FaRegMoneyBill1 size={50} color="#714b67" />
                        )}

                        {item.address_type === ContactOptionEnum.DELIVERY_ADDRESS && (
                          <FaTruck size={50} color="#714b67" />
                        )}

                        {(item.address_type === ContactOptionEnum.ADD_CONTACT ||
                          item.address_type === ContactOptionEnum.ANOTHER_ADDRESS) && (
                          <>
                            {item['type'] === 'I' ? (
                              <LuUser className=" w-14 h-14 text-gray-400" />
                            ) : (
                              <BsBuildings className=" w-14 h-14 text-gray-400" />
                            )}
                          </>
                        )}
                        {item.address_type === 'AD' && (
                          <BsBuildings className=" w-14 h-14 text-gray-400" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="oe_kanban_details ">
              <div className="o_kanban_record_top mb-0 ">
                <div className="o_kanban_record_headings ">
                  <strong className="o_kanban_record_title">
                    <span>{item['full_name']}</span>
                  </strong>
                </div>
              </div>

              <div className="w-full o_kanban_tags_section">
                <div className="d-flex flex-wrap gap-1">
                  {item?.categories?.map((tag: any) => (
                    <span className="o_tag" style={{ backgroundColor: tag?.color }} key={tag.label}>
                      <div className="text-truncate">{tag?.full_name}</div>
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <p className="text-sm mt-1">{item['pt_trab__name_rel_full']}</p>{' '}
                <p className="text-sm mt-1">{item['location_sl2_name__location_country_name']}</p>
                <p className="text-sm mt-1">{item['email']}</p>
              </div>
            </div>
          </>
        )}
        {/*FACTURAS */}
        {fnc_name === 'fnc_account_move' && (
          <>
            <div className="oe_kanban_details ">
              <div className="o_kanban_record_top mb-0 ">
                <div className="o_kanban_record_headings">
                  <strong className="o_kanban_record_title">
                    <span>{item?.partner_name}</span>
                  </strong>
                </div>
              </div>

              <div className="w-full">
                <p className="text-sm mt-1">{item?.name}</p>
              </div>
            </div>
          </>
        )}
        {/* ************** Productos ************** */}
        {fnc_name === 'fnc_product_template' && (
          <>
            <div className="oe_kanban_details ">
              <div className="o_kanban_record_top mb-0 ">
                <div
                  className={`flex justify-center ${changeFavoriteId ? 'pointer-events-none' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setChangeFavoriteId(item?.product_template_id)
                  }}
                >
                  {item.is_favorite ? <FaStar fill="#FFDE21" size={18} /> : <FaRegStar size={18} />}
                </div>
                <div className="o_kanban_record_headings">
                  <strong className="o_kanban_record_title">
                    <span>{item?.name}</span>
                  </strong>
                </div>
              </div>

              <div className="w-full">
                {item?.variants && (
                  <p className="font-bold">
                    {item?.number_variants} Variante{item?.number_variants > 1 && 's'}
                  </p>
                )}
                {item?.ref_interna && <p className="text-sm mt-1">[{item?.ref_interna}]</p>}

                <p className="text-sm mt-1">
                  Precio: {item?.currentcy_id || 'S/'} {item?.sale_price || 0}
                </p>
              </div>
            </div>

            {uri && (
              <div className="c_imageEx_64 self-center">
                <img
                  src={uri}
                  alt="image products"
                  width={200}
                  height={200}
                  className="object-cover object-center imageEx_64"
                />
              </div>
            )}
          </>
        )}
        {/* ************** Variantes de Productos ************** */}
        {fnc_name === 'fnc_product' && (
          <>
            <div className="oe_kanban_details ">
              <div className="o_kanban_record_top mb-0 ">
                <div
                  className={`flex justify-center ${changeFavoriteId ? 'pointer-events-none' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setChangeFavoriteId(item?.product_id)
                  }}
                >
                  {item.is_favorite ? <FaStar fill="#FFDE21" size={18} /> : <FaRegStar size={18} />}
                </div>

                <div className="o_kanban_record_headings">
                  <strong className="o_kanban_record_title">
                    <span>{item?.name}</span>
                  </strong>
                </div>
              </div>

              <div className="w-full">
                {item?.variants?.map((variant: any) => (
                  <Chip
                    key={variant.attribute_value_id}
                    label={variant.name}
                    sx={{
                      marginRight: 1,
                      background: '#E6DDDD',
                      fontSize: '0.65rem',
                      height: '20px',
                      marginBottom: 1,
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        fontSize: '0.65rem',
                      },
                      '& .MuiChip-deleteIcon': {
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                ))}
                <p className="text-sm mt-1">
                  Precio: {item?.currentcy_id || 'S/'} {item?.sale_price || 0}
                </p>
              </div>
            </div>

            {uri && (
              <div className="c_imageEx_64 self-center">
                <img
                  src={uri}
                  alt="image products"
                  width={200}
                  height={200}
                  className="object-cover object-center imageEx_64"
                />
              </div>
            )}
          </>
        )}
        {fnc_name === 'fnc_journal' && <Kanbanchart />}
      </div>
    </div>
  )
}
