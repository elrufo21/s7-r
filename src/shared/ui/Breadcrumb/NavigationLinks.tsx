import useAppStore from '@/store/app/appStore'
import { Tooltip, IconButton, Menu, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom'
import { LinkItem } from './breadcrumb.types'
import React, { ReactNode, useState } from 'react'
import { IoIosMore } from 'react-icons/io'

interface NavigationLinksProps {
  links: LinkItem[]
}

export const NavigationLinks = ({ links }: NavigationLinksProps): ReactNode => {
  const { setViewType, setBreadcrumb, setTableData } = useAppStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  if (links.length === 0) {
    return <></>
  }
  const redirectToUrl = (link: LinkItem) => {
    setViewType(link.viewType)
    setTableData([])
    const index = links.findIndex((item) => item.url === link.url)

    const newLinks = links.slice(0, index)
    if (links.length === 1) return

    setBreadcrumb(newLinks)
    handleClose()
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const visibleLinks = links.length > 2 ? links.slice(-2) : links
  const menuLinks = links.length > 2 ? links.slice(0, -2).reverse() : []
  return (
    // <ul className="breadcrumb font-semibold mt-1">
    <ul className="breadcrumb flex-nowrap text-nowrap lh-sm    font-semibold">
      {menuLinks.length > 0 && (
        <li
          // className="breadcrumb-item text-muted"
          className="breadcrumb-item d-inline-flex min-w-0"
          style={{ display: 'flex', alignItems: 'flex-start' }}
        >
          <IconButton
            size="small"
            aria-label="more"
            style={{
              width: 23,
              height: 15,
              borderRadius: 4,
              color: '#374151',
              alignSelf: 'end',
              paddingBottom: 0,
              paddingTop: '8px',
            }}
            onClick={handleClick}
          >
            <IoIosMore />
          </IconButton>
          <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
            {menuLinks.map((link, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  redirectToUrl(link)
                }}
              >
                <Tooltip title={'Regresar a "' + link.title + '"'}>
                  <Link to={link.url} className="text-truncate link-primary">
                    {link.title}
                  </Link>
                </Tooltip>
              </MenuItem>
            ))}
          </Menu>
        </li>
      )}

      {visibleLinks.map((link, i) => (
        // <li key={i} className="breadcrumb-item text-muted cursor-none">
        <li key={i} className="breadcrumb-item d-inline-flex min-w-0">
          {link.url != null ? (
            <Tooltip title={'Regresar a "' + link.title + '"'}>
              <Link
                to={link.url}
                className="text-truncate link-primary"
                onClick={() => redirectToUrl(link)}
              >
                {link.title}
              </Link>
            </Tooltip>
          ) : (
            <>{link.title}</>
          )}
        </li>
      ))}
    </ul>
  )
}
