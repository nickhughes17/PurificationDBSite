import React from 'react'
import { Link } from 'react-router-dom'

export default function home() {
  return (
    <div className='home'>
        <header className="header">
          <div className="header-contents">
            <div className="logo"><p>Purification DB</p></div>
            <ul id="list-1">
              <li>
                <Link to="/Database">Database</Link>
              </li>
            </ul>
          </div>
        </header>
        <div className="main">
          <div className="index-top-row">
              <h2>About</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                  sed do eiusmod tempor incididunt ut labore et dolore magna 
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris</p>
          </div>
          <div className="index-middle-row">
              <h2>Contact</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                  sed do eiusmod tempor incididunt ut labore et dolore magna 
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris</p>
          </div>
        </div>
    </div>
  )
}
