import useAppStore from '@/store/app/appStore'
import { KanbanBox } from './kanban/kanbanBox'
import { FormConfig } from '@/shared/shared.types'
import { useNavigate } from 'react-router-dom'
import { CustomToast } from '@/components/toast/CustomToast'

type KanbanViewProps = {
  config: FormConfig
}

export const KanbanView = ({ config }: KanbanViewProps) => {
  const navigate = useNavigate()
  const { setSessionId, setSyncData } = useAppStore()
  const {
    dataKanbanShow: { dataShow },
    setDataFormShow,
  } = useAppStore((state) => state)

  const fnc_name = config.fnc_name
  const idRow = config.grid.idRow as keyof any
  const viewItem = async (item: any) => {
    setDataFormShow(dataShow)
    setSessionId(item['session_id'])
    navigate(`${config.item_url}/${item?.[idRow]}`)
  }
  if (fnc_name === 'fnc_pos_point')
    return (
      <>
        {dataShow.map((item, index) => (
          <div key={index} className="oe_kanban_card flex pos_point">
            <div
              role="article"
              className="o_kanban_record d-flex flex-grow-1 flex-md-shrink-1 flex-shrink-0"
              //onClick={() => viewItem(item)}
            >
              <div className="oe_kanban_card oe_kanban_global_click flex">
                {/*
                <div className="imageEx_64">
                  <div className="flex justify-center items-center w-full h-full "></div>
                </div>
                */}

                <div className="oe_kanban_details ">
                  <div className="o_kanban_record_top">
                    <div className="o_kanban_record_headings ">
                      <strong className="o_kanban_record_title">
                        <span>{item['name']}</span>
                      </strong>
                    </div>
                  </div>

                  {/*
                  <div className="w-full o_kanban_tags_section">
                    <div className="d-flex flex-wrap gap-1">
                      <p className="text-sm mt-1">
                        <span>Cierre </span>
                        <span className="col-6">02/07/2025</span>
                      </p>{' '}
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      <p className="text-sm mt-1">
                        <span>Balance</span>
                        <span className="col-6">100000</span>
                      </p>{' '}
                    </div>
                  </div>
                  */}

                  <div className="w-full o_kanban_tags_section"></div>

                  <div className="w-full">
                    {item?.session_id ? (
                      <button
                        className="btn btn-primary oe_kanban_action"
                        onClick={(e) => {
                          e.stopPropagation()

                          const localPosOpen = JSON.parse(
                            localStorage.getItem('local_pos_open') || '[]'
                          )
                          const isOpen = localPosOpen.some(
                            (p: any) => p?.point_id === item.point_id
                          )

                          if (!isOpen) {
                            CustomToast({
                              title: 'No se puede seguir vendiendo',
                              description: `Otro usuario esta en el punto de venta.`,
                              type: 'warning',
                            })
                            console.warn(
                              `Punto ${item.point_id} no está en local_pos_open. No se abrirá.`
                            )
                            return // ❌ NO seguimos vendiendo si no está registrado
                          }

                          const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')

                          const targetSession = {
                            session_id: item.session_id ?? null,
                            point_id: item.point_id,
                            session_name: item.name,
                            active: true,
                          }

                          const nextSessions = sessions.map((s: any) =>
                            s.point_id === item.point_id ? targetSession : { ...s, active: false }
                          )

                          if (!nextSessions.find((s: any) => s.point_id === item.point_id)) {
                            nextSessions.push(targetSession)
                          }

                          const prevActive = sessions.find((s: any) => s.active)
                          if (!prevActive || prevActive.point_id !== item.point_id) {
                            setSyncData(true)
                          }

                          localStorage.setItem('sessions', JSON.stringify(nextSessions))
                          navigate(`/pos/${item.point_id}`)
                        }}
                      >
                        Seguir vendiendo
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary oe_kanban_action"
                        onClick={(e) => {
                          e.stopPropagation()

                          const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')

                          const targetSession = {
                            session_id: null,
                            point_id: item.point_id,
                            session_name: item.name,
                            active: true,
                          }

                          const nextSessions = sessions.map((s: any) =>
                            s.point_id === item.point_id ? targetSession : { ...s, active: false }
                          )

                          if (!nextSessions.find((s: any) => s.point_id === item.point_id)) {
                            nextSessions.push(targetSession)
                          }

                          const prevActive = sessions.find((s: any) => s.active)
                          if (!prevActive || prevActive.point_id !== item.point_id) {
                            setSyncData(true)
                          }

                          localStorage.setItem('sessions', JSON.stringify(nextSessions))
                          navigate(`/pos/${item.point_id}`)
                        }}
                      >
                        Aperturar caja
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    )

  if (!dataShow.length && fnc_name !== ' fnc_point_of_sale')
    return (
      <div className="o_view_nocontent">
        <div className="w-full h-full flex flex-col justify-center items-center gap-3">
          <img src="/images/not-content.svg" />
          <h2 className="text-center text-[1.25rem] font-bold ">{config.no_content_title}</h2>
          <h2 className="text-center text-[1rem]">{config.no_content_dsc}</h2>
        </div>
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
