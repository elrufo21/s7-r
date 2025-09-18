import { PageCounterProps } from '@/shared/components/navigation/navigation.types'
import { modifyFiltersPag } from '@/shared/components/navigation/utils'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useEffect, useState } from 'react'
import { GrNext, GrPrevious } from 'react-icons/gr'

export const PageCounterKanban = () => {
  const {
    dataKanbanShow: { counterPage, totalPages },
    kanbanCurrentPage,
    actualCurrentPage,
    setActualCurrentPage,
    setKanbanCurrentPage,
    frmLoading,
  } = useAppStore()
  const { filters, setFilters } = useUserStore()

  useEffect(() => {
    const filtersModified = modifyFiltersPag(filters, kanbanCurrentPage)
    setFilters(filtersModified, actualCurrentPage)
  }, [kanbanCurrentPage])

  const [pageCounter, setPageCounter] = useState<PageCounterProps>(
    counterPage
      ? counterPage
      : {
          lowerLimit: 0,
          totalElements: 0,
          upperLimit: 0,
        }
  )

  const handlePrev = () => {
    if (totalPages === 1) return
    if (kanbanCurrentPage === 1) return setKanbanCurrentPage(totalPages)
    setActualCurrentPage(kanbanCurrentPage - 1)
    setKanbanCurrentPage(kanbanCurrentPage - 1)
  }
  const handleNext = () => {
    if (totalPages === 1) return
    if (kanbanCurrentPage === totalPages) return setKanbanCurrentPage(1)
    setActualCurrentPage(kanbanCurrentPage + 1)
    setKanbanCurrentPage(kanbanCurrentPage + 1)
  }

  useEffect(() => {
    if (counterPage) setPageCounter(counterPage)
  }, [counterPage])

  return (
    <>
      <div className="flex flex-col justify-center mr-3">
        <span className="text-sm">
          {pageCounter.lowerLimit}-{pageCounter.upperLimit} / {pageCounter.totalElements}
        </span>
      </div>

      <ToggleButtonGroup aria-label="text formatting">
        <ToggleButton
          value="prev"
          onClick={handlePrev}
          sx={{ height: '37px', width: '38px' }}
          disabled={frmLoading}
        >
          <GrPrevious />
        </ToggleButton>

        <ToggleButton
          value="next"
          onClick={handleNext}
          sx={{ height: '37px', width: '38px' }}
          disabled={frmLoading}
        >
          <GrNext />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}
