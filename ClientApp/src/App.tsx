import React from 'react'

import avatar from './images/avatar.png'
import { Link, Route, Routes } from 'react-router-dom'
import { Restaurants } from './pages/Restaurants'
import { NewRestaurant } from './pages/NewRestaurant'
import { getUser, isLoggedIn, logout } from './auth'
// import { SignUp } from './pages/SignUp'
// import { SignIn } from './pages/SignIn'

function handleLogout() {
  logout()

  window.location.assign('/')
}

const user = getUser()

export function App() {
  return (
    <>
      <header>
        <ul>
          <li>
            <nav>
              {isLoggedIn() ? (
                <Link to="/new">
                  <i className="fa fa-plus"></i>
                  Restaurant
                </Link>
              ) : null}
              {/* Here we test if the user is logged in, and if they are not then we show the <Link>.This code effectively only shows the links if the user is not logged in. */}
              {isLoggedIn() ? null : <Link to="/signup">Sign Up</Link>}
              {isLoggedIn() ? null : <Link to="/signin">Sign In</Link>}
              {isLoggedIn() ? (
                <a
                  href="/"
                  className="link"
                  onClick={function (event) {
                    event.preventDefault()
                    handleLogout()
                  }}
                >
                  Sign Out
                </a>
              ) : null}
              {isLoggedIn() ? <p>Welcome back, {user.fullName}!</p> : null}
            </nav>
          </li>
          <li className="avatar">
            <img src={avatar} alt="Steve's Avatar" height="64" width="64" />
          </li>
        </ul>
      </header>
      {/* <Restaurants /> */}
      <Routes>
        <Route path="*" element={<Restaurants />} />
        <Route path="/new" element={<NewRestaurant />} />
        <Route path="/signup" />
        <Route path="/signin" />
      </Routes>

      <footer>
        <p>
          Built with <i className="fa fa-heart"></i> in St Petersburg, Florida.
        </p>
      </footer>
    </>
  )
}
