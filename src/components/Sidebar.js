// src/components/SidebarComponent.js
import React from 'react'
import {
    CSidebar,
    CSidebarBrand,
    CSidebarHeader,
    CSidebarNav,
    CSidebarToggler,
    CNavGroup,
    CNavItem,
    CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
    cilCursor,
    cilCloudDownload,
    cilReload,
    cilFolder,
} from '@coreui/icons'

import './Sidebar.css'

const Sidebar = ({ modo, opcion, setOpcion }) => {
    if (modo !== 'predecir') {
        return null // No renderizar el sidebar si no está en modo "predecir"
    }

    return (
        <div className="sidebar-wrapper">
            <CSidebar className="custom-sidebar">
                <CSidebarHeader className="border-bottom"></CSidebarHeader>
                <CSidebarNav>
                    <CNavTitle className="nav-title">Menú</CNavTitle>

                    <CNavItem
                        href="#"
                        active={opcion === 'una'}
                        onClick={() => setOpcion('una')}
                        className={opcion === 'una' ? 'active-item' : ''
                        }
                    >
                        Predecir una sola noticia
                    </CNavItem>

                    <CNavItem
                        href="#"
                        active={opcion === 'csv'}
                        onClick={() => setOpcion('csv')}
                        className={opcion === 'csv' ? 'active-item' : ''}
                    >
                        Predecir más de una noticia
                    </CNavItem>
                </CSidebarNav>

                <CSidebarHeader className="border-top">
                    <CSidebarToggler />
                </CSidebarHeader>
            </CSidebar>
        </div>
    )
}

export default Sidebar
