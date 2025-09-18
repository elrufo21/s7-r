import { Box, Tab, Tabs as TabsMui, Typography } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { TabPanel } from './TabPanel'
import { ConfigType, TabProp } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'

interface TabsProps {
  list: TabProp[]
  watch: any
  control: any
  errors: any
  setValue: any
  editConfig: any
  type_config?: ConfigType
  idDialog: number
  frmState?: any
}

export const Tabs = ({
  list,
  watch,
  control,
  errors,
  setValue,
  editConfig,
  type_config = ConfigType.KANBAN,
  idDialog,
}: TabsProps) => {
  const { tabForm, setTabForm, hiddenTabs } = useAppStore()
  const [tabValue, setTabValue] = useState<number>(tabForm)

  useEffect(() => {
    setTabValue(tabForm)
  }, [tabForm])
  useEffect(() => {
    setTabForm(tabValue)
  }, [tabValue])
  const tabItemProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleChange = (event: SyntheticEvent<Element, Event>, newValue: number) => {
    event.preventDefault()
    setTabValue(newValue)
  }
  const filteredTabs = list.filter((tab) => !hiddenTabs.includes(tab.name) && watch !== tab.name)

  return (
    <Box sx={{ width: '100%' }} className="tabEx">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabsMui value={tabValue} onChange={handleChange}>
          {filteredTabs.map((tab, index) => (
            <Tab
              label={
                <Typography fontSize={'14.4px'} sx={{ textTransform: 'none' }}>
                  {tab?.name}
                </Typography>
              }
              {...tabItemProps(index)}
              key={index}
            />
          ))}
        </TabsMui>
      </Box>
      {filteredTabs.map((tab, i) => (
        <TabPanel key={i} value={tabValue} index={i}>
          <div className="w-full">
            {tab?.content &&
              tab.content({
                watch,
                control,
                errors,
                setValue,
                editConfig,
                type_config,
                idDialog,
              })}
          </div>
        </TabPanel>
      ))}
    </Box>
  )
}
