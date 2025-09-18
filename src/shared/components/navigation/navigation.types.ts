import { MenuProps } from '@mui/material/Menu'
import { ReactNode } from 'react'
import { FormConfig } from '@/shared/shared.types'

// ===== TIPOS BÁSICOS DE NAVEGACIÓN =====

export type MenuItemType = {
  title: string
  key: string
  path?: string
  items?: MenuItemType[]
  // ✅ Propiedades para modales
  openAsModal?: boolean
  modalConfig?: ModalConfigType
}

// ===== CONFIGURACIÓN DE MODALES =====

export type ModalConfigType = {
  size?: ModalSizeType
  title?: string
  config: FormConfig // ✅ El config que se pasa al modal
  customButtons?: ModalButtonType[] // ✅ Botones personalizados simples
}

// ===== TIPOS PARA BOTONES DE MODAL =====

export type ModalButtonType = {
  text: string
  type?: 'primary' | 'secondary' | 'cancel' | 'danger' | 'confirm'
  onClick: (dialogId: string, closeDialogWithData: (id: string, data: any) => void) => void
}

// ===== TIPOS DE TAMAÑOS DE MODAL =====

export type ModalSizeType =
  | 'small' // 400px
  | 'medium' // 600px
  | 'large' // 800px
  | 'xlarge' // 1000px
  | 'fullscreen' // 100%

// ===== TIPOS PARA EL MENÚ (existentes) =====

export interface MenuNavigationProps {
  navigation: MenuItemType | null
  anchor: HTMLElement | null
  handleClose: () => void
  menuProps?: Partial<MenuProps>
}

export interface DropdownMenuProps {
  title: string
  children: ReactNode
}

// ===== FUNCIONES UTILITARIAS =====

/**
 * Extrae el ID de acción de una ruta como /action/894
 */
export const extractActionId = (path: string): string | null => {
  const match = path.match(/\/action\/(\d+)/)
  return match ? match[1] : null
}

/**
 * Genera la clave de configuración basada en el ID de acción
 */
export const getConfigKey = (actionId: string): string => {
  return `action_${actionId}_config`
}

/**
 * Valida si un item debe abrirse como modal
 */
export const shouldOpenAsModal = (item: MenuItemType): boolean => {
  return item.openAsModal === true && !!item.modalConfig?.config
}

/**
 * Obtiene el título del modal (usa modalConfig.title o item.title como fallback)
 */
export const getModalTitle = (item: MenuItemType): string => {
  return item.modalConfig?.title || item.title
}

/**
 * Obtiene el tamaño del modal (default: 'medium')
 */
export const getModalSize = (item: MenuItemType): ModalSizeType => {
  return item.modalConfig?.size || 'medium'
}

// ===== TIPOS EXISTENTES (mantenidos) =====

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

// ===== CONSTANTES =====

export const MODAL_SIZES: Record<ModalSizeType, { width?: string; height?: string }> = {
  small: { width: '400px' },
  medium: { width: '600px' },
  large: { width: '900px' },
  xlarge: { width: '1200px' },
  fullscreen: { width: '100vw', height: '100vh' },
}
