import React from 'react'
import { HeaderBar } from '../components/HeaderBar'

export const Home = () => {
  return (
    <div className='home'>
      <HeaderBar currentPage={"Home"}></HeaderBar>
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
