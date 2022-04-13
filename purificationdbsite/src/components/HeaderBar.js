import React from 'react'
import { Link } from 'react-router-dom'

export const HeaderBar = (currentPage) => {

    return (
        <div className="header">
            <div className="header-contents">
                <div className="logo-container"><p className="logo">PurificationDB</p></div>
                <div className="page-list-container">
                    <ul id="list-1">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/Search">Search</Link></li>
                        <li><Link to="/Database">Database</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}