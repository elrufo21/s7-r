import { PageCounterProps } from '@/shared/components/navigation/navigation.types'
import { modifyFiltersPag } from '@/shared/components/navigation/utils'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useEffect, useState } from 'react'
import { GrNext, GrPrevious } from 'react-icons/gr'
import useAppStore from '@/store/app/appStore'

type PageCounterListProps = {
  counterPage: any
  totalPages: number
  listCurrentPage: number
  setListCurrentPage: any
  actualCurrentPage: number
  setActualCurrentPage: any
  filters: any
  setFilters: any
}

export const PageCounterList = ({
  counterPage,
  totalPages,
  listCurrentPage,
  setListCurrentPage,
  actualCurrentPage,
  setActualCurrentPage,
  filters,
  setFilters,
}: PageCounterListProps) => {
  /**
   * 
  const {
    dataListShow: { counterPage, totalPages },
    listCurrentPage,
    setListCurrentPage,
    actualCurrentPage,
    setActualCurrentPage,
  } = useAppStore()
  const { filters, setFilters } = useUserStore()
   */
  const { frmLoading } = useAppStore()
  const [pageCounter, setPageCounter] = useState<PageCounterProps>({
    lowerLimit: 0,
    totalElements: 0,
    upperLimit: 0,
  })

  useEffect(() => {
    const filtersModified = modifyFiltersPag(filters, listCurrentPage)
    setFilters(filtersModified, actualCurrentPage)
  }, [listCurrentPage])

  const handlePrev = () => {
    if (totalPages === 1) return
    if (listCurrentPage === 1) return setListCurrentPage(totalPages)

    setActualCurrentPage(listCurrentPage - 1)

    setListCurrentPage(listCurrentPage - 1)
  }
  const handleNext = () => {
    if (totalPages === 1) return
    if (listCurrentPage === totalPages) return setListCurrentPage(1)
    setActualCurrentPage(listCurrentPage + 1)
    setListCurrentPage(listCurrentPage + 1)
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
