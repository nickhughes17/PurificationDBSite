import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export const HeaderBar = ({currentPage}) => {


    useEffect(() => {
        if(currentPage){
            console.log(document.getElementById(currentPage));
            document.getElementById(`${currentPage}`).classList.toggle("currentPage");
        }
    }, [currentPage])
    
    return (
        <div className="header">
            <div className="header-contents">
                <div className="logo-container"><p className="logo">PURIFICATIONDB</p></div>
                <div className="page-list-container">
                    <ul id="list-1">
                        <li><Link id="Home" to="/">Home</Link></li>
                        <li><Link id="Search" to="/Search">Search</Link></li>
                        <li><Link id="Database" to="/Database">Database</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}