import React from 'react'

import avatar from './images/avatar.png'
import { Route, Routes } from 'react-router-dom'
import { Restaurants } from './pages/Restaurants'
import { NewRestaurant } from './pages/NewRestaurant'

export function App() {
  return (
    <>
      <header>
        <ul>
          <li>
            <nav>
              <a href="/new">
                <i className="fa fa-plus"></i> Restaurant
              </a>
              <p>Welcome back, Steveeeeeeeee!</p>
            </nav>
          </li>
          <li className="avatar">
            <img src={avatar} alt="Steve's Avatar" height="64" width="64" />
          </li>
        </ul>
      </header>
      {/* <Restaurants /> */}
      <Routes>
        <Route path="/" element={<Restaurants />} />
        <Route path="/new" element={<NewRestaurant />} />
      </Routes>

      <footer>
        <p>
          Built with <i className="fa fa-heart"></i> in St Petersburg, Florida.
        </p>
      </footer>
    </>
  )
}
