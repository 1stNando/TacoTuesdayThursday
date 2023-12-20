import React from 'react'

import avatar from './images/avatar.png'
import { Link, Route, Routes } from 'react-router-dom'
import { Restaurants } from './pages/Restaurants'
import { NewRestaurant } from './pages/NewRestaurant'
import { getUser, isLoggedIn, logout } from './auth'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'

// function handleLogout() {
//   logout()

//   window.location.assign('/')
// }

// const user = getUser()

// This is rendering the menu bar found on the landing page "Restaurants".
export function App() {
  return (
    <>
      <header>
        <ul>
          <li>
            <nav>
              <Link to="/new">
                <i className="fa fa-plus"></i> Restaurant
              </Link>
              <Link to="/signup">Sign Up</Link>
              <p>Welcome back, Steve!</p>
            </nav>
          </li>
          <li className="avatar">
            <img src={avatar} alt="Steve's Avatar" height="64" width="64" />
          </li>
        </ul>
      </header>

      <Routes>
        <Route path="*" element={<Restaurants />} />
        <Route path="/new" element={<NewRestaurant />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>

      <footer>
        <p>
          Built with <i className="fa fa-heart"></i> in St Petersburg, Florida.
        </p>
      </footer>
    </>
  )
}
