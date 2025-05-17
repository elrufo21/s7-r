import { MenuProps } from '@mui/material/Menu'
import { ReactNode } from 'react'

export type MenuItemType = {
  title: string
  key: string
  path?: string
  items?: MenuItemType[]
}

export type PageCounterProps = {
  lowerLimit: number
  upperLimit: number
  totalElements: number
}

export interface StyledMenuProps extends MenuProps {
  children?: ReactNode
}

export enum SearchFiltersEnum {
  GROUP_BY = 'gby',
  ORDER_BY = 'oby',
  FILTER_BY = 'fcon',
  BY_INPUT = 'fcol',
  PAGINATION = 'pag',
}

export interface CompaniesType {
  name: string
  companies: CompaniesType[] | null
  company_id: number
  allChildrenIds?: string
}
