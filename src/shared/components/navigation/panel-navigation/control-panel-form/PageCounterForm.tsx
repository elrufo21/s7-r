import { DataType } from '@/shared/components/view-types/viewTypes.types'
import { ModulesEnum } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useEffect, useState } from 'react'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export const PageCounterForm = () => {
  const params = useParams()
  const path = Object.values(params)[0] ?? ''
  const id = path.split('/').at(-1)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    config,
    dataFormShow,
    formItem,
    setDataFormShow,
    setTableData,
    setFrmIsChanged,
    setFrmIsChangedItem,
    breadcrumb,
    previousDataBeforeMenu,
    setPreviousDataBeforeMenu,
  } = useAppStore()
  const idRow = config.grid.idRow as keyof DataType

  const [pageCounter, setPageCounter] = useState({
    currentPage: 0,
    totalElements: 0,
  })

  useEffect(() => {
    const currentDataFormShow =
      dataFormShow.length > 0 ? dataFormShow : previousDataBeforeMenu?.dataFormShow || []

    const isEmpty = !currentDataFormShow.length
    const newPageCounter = isEmpty
      ? { currentPage: 1, totalElements: 1 }
      : {
          currentPage: !Number(id)
            ? 1
            : currentDataFormShow.findIndex((elem) => elem[idRow] === Number(id)) + 1,
          totalElements: currentDataFormShow.length,
        }

    if (isEmpty && formItem) {
      const newData = [formItem]
      setDataFormShow(newData)
      setPreviousDataBeforeMenu({
        formItem: formItem,
        breadcrumb: breadcrumb,
        url: pathname,
        dataFormShow: newData,
      })
    } else if (currentDataFormShow.length > 0 && dataFormShow.length === 0) {
      setDataFormShow(currentDataFormShow)
    }

    setPageCounter(newPageCounter)
  }, [
    dataFormShow,
    id,
    formItem,
    idRow,
    setDataFormShow,
    previousDataBeforeMenu,
    setPreviousDataBeforeMenu,
    breadcrumb,
    pathname,
  ])

  const navigateToRow = (index: number) => {
    const currentData =
      dataFormShow.length > 0 ? dataFormShow : previousDataBeforeMenu?.dataFormShow || []

    const targetRow = currentData[index % currentData.length]
    console.log('targetRow', targetRow, index)
    navigate(
      `${config.module_url.includes(ModulesEnum.ACTION) ? config.item_url : config.module_url}/${targetRow[idRow]}`
    )
  }

  const handlePrev = () => {
    setFrmIsChanged(false)
    setFrmIsChangedItem(false)
    if (pageCounter.totalElements === 1) return
    setTableData([])
    const newLowerLimit = pageCounter.currentPage
    if (newLowerLimit === 1) {
      navigateToRow(pageCounter.totalElements - 1)
    } else {
      navigateToRow(newLowerLimit - 2)
    }
  }

  const handleNext = () => {
    setFrmIsChanged(false)
    setFrmIsChangedItem(false)
    if (pageCounter.totalElements === 1) return
    setTableData([])
    if (pageCounter.currentPage >= pageCounter.totalElements) {
      navigateToRow(0)
    } else {
      navigateToRow(pageCounter.currentPage)
    }
  }

  if (pathname?.includes('/new')) return <></>
  return (
    <>
      <div className="flex flex-col justify-center mr-3">
        <span className="text-sm">
          {pageCounter.currentPage && breadcrumb.length == 1 ? pageCounter.currentPage : 1} /{' '}
          {pageCounter.totalElements && breadcrumb.length == 1 ? pageCounter.totalElements : 1}
        </span>
      </div>

      <ToggleButtonGroup aria-label="text formatting">
        <ToggleButton
          value="prev"
          onClick={handlePrev}
          disabled={breadcrumb.length > 1}
          sx={{ height: '37px', width: '38px' }}
        >
          <GrPrevious />
        </ToggleButton>

        <ToggleButton
          value="next"
          onClick={handleNext}
          disabled={breadcrumb.length > 1}
          sx={{ height: '37px', width: '38px' }}
        >
          <GrNext />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}
