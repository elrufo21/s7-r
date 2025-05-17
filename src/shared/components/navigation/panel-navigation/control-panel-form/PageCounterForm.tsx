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
  const { config, dataFormShow, formItem, setDataFormShow, setTableData } = useAppStore()
  const idRow = config.grid.idRow as keyof DataType

  const [pageCounter, setPageCounter] = useState({
    currentPage: 0,
    totalElements: 0,
  })
  useEffect(() => {
    const isEmpty = !dataFormShow.length
    const newPageCounter = isEmpty
      ? { currentPage: 1, totalElements: 1 }
      : {
          currentPage: !Number(id)
            ? 1
            : dataFormShow.findIndex((elem) => elem[idRow] === Number(id)) + 1,
          totalElements: dataFormShow.length,
        }
    if (isEmpty && formItem) {
      setDataFormShow([formItem])
    }
    setPageCounter(newPageCounter)
  }, [dataFormShow, id, dataFormShow])
  const navigateToRow = (index: number) => {
    const targetRow = dataFormShow[index % dataFormShow.length]
    navigate(
      `${config.module_url.includes(ModulesEnum.ACTION) ? config.item_url : config.module_url}/${targetRow[idRow]}`
    )
  }

  const handlePrev = () => {
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
          {pageCounter.currentPage ? pageCounter.currentPage : 1} /{' '}
          {pageCounter.totalElements ? pageCounter.totalElements : 1}
        </span>
      </div>

      <ToggleButtonGroup aria-label="text formatting">
        <ToggleButton value="prev" onClick={handlePrev} sx={{ height: '37px', width: '38px' }}>
          <GrPrevious />
        </ToggleButton>

        <ToggleButton value="next" onClick={handleNext} sx={{ height: '37px', width: '38px' }}>
          <GrNext />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}
