import { Tooltip } from '@mui/material'
import { TbArrowNarrowRight } from 'react-icons/tb'

const SettingSection = ({
  title,
  id_component,
}: {
  title: string
  id_component: string
  right_panes: any[]
  left_panes: any[]
}) => {
  return (
    <div id={id_component}>
      <h2>
        <span>{title}</span>
      </h2>
      <div className="row mt-2 o_settings_container">
        <div
          className="o_setting_box col-12 col-lg-6 o_searchable_setting"
          id="invite_users_setting"
        >
          <div className="o_setting_right_pane">
            <div className="mt-2">
              <p className="o_form_label">Gestione sus certificados</p>
              <div className="d-flex">
                <div
                  className="text-teal-600 cursor-pointer font-semibold justify-center"
                  onClick={() => {}}
                >
                  <Tooltip title="Ver producto" placement="bottom">
                    <button type="button" className="cursor-pointer ml-1 w-fit flex">
                      <TbArrowNarrowRight className="w-5 h-6 text-gray-500 hover:text-teal-600" />
                      Certificados
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="o_setting_box col-12 col-lg-6 o_searchable_setting"
          id="active_user_setting"
        >
          <div className="o_setting_right_pane">
            <div className="mt16">
              <p className="o_form_label">Gestione sus claves</p>
              <div className="d-flex">
                <div
                  className="text-teal-600 cursor-pointer font-semibold justify-center"
                  onClick={() => {}}
                >
                  <Tooltip title="Ver producto" placement="bottom">
                    <button type="button" className="cursor-pointer ml-1 w-fit flex">
                      <TbArrowNarrowRight className="w-5 h-6 text-gray-500 hover:text-teal-600" />
                      Claves
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingSection
