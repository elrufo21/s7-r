import useAppStore from '@/store/app/appStore'
import { KanbanBox } from './kanban/kanbanBox'
import { FormConfig } from '@/shared/shared.types'
import { useNavigate } from 'react-router-dom'

type KanbanViewProps = {
  config: FormConfig
}

export const KanbanView = ({ config }: KanbanViewProps) => {
  const navigate = useNavigate()

  const {
    dataKanbanShow: { dataShow },
    setDataFormShow,
    frmLoading,
  } = useAppStore((state) => state)

  const fnc_name = config.fnc_name
  const idRow = config.grid.idRow as keyof any
  const viewItem = async (item: any) => {
    setDataFormShow(dataShow)
    navigate(`${config.item_url}/${item?.[idRow]}`)
  }

  if (fnc_name === 'fnc_point_of_sale')
    return (
      <div className="oe_kanban_card flex">
        <div
          role="article"
          className="o_kanban_record d-flex flex-grow-1 flex-md-shrink-1 flex-shrink-0"
        >
          <>
            <div className="oe_kanban_details ">
              <div className="o_kanban_record_top mb-0 ">
                <div className="o_kanban_record_headings">
                  <strong className="o_kanban_record_title">
                    <span>Tienda 1</span>
                  </strong>
                </div>
              </div>

              <div className="row g-0 pb-4 ms-2 mt-auto">
                <div className="col-6 d-flex flex-wrap align-items-center gap-3">
                  <button
                    className="btn btn-primary oe_kanban_action"
                    onClick={() => {
                      navigate('/pos')
                    }}
                  >
                    Seguir vendiendo
                  </button>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-6">
                      <span>Cierre</span>
                    </div>
                    <span className="col-6">14/05/2025</span>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <span>Balance</span>
                    </div>
                    <div
                      className="o_field_widget o_readonly_modifier o_field_empty o_field_monetary col-6"
                      data-name="last_session_closing_cash"
                    >
                      <span>S/&nbsp;0,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    )
  if (frmLoading) {
    return null
  }

  if (!dataShow.length && fnc_name !== ' fnc_point_of_sale')
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <img src="/images/not-content.svg" />
        <h2 className="text-lg text-center">{config.no_content_dsc}</h2>
      </div>
    )

  return (
    <>
      {dataShow.filter((elem) => elem[idRow]).length > 0 &&
        dataShow
          .filter((elem) => elem[idRow])
          .map((item, index: number) => (
            <KanbanBox item={item} index={index} fnc={viewItem} key={index} fnc_name={fnc_name} />
          ))}
      {Array.from({ length: fnc_name === 'fnc_journal' ? 2 : 5 }).map((_, index) => (
        <div
          key={index}
          className="o_kanban_record   o_kanban_ghost flex-grow-1 flex-md-shrink-1 flex-shrink-0 my-0"
        ></div>
      ))}
    </>
  )
}
