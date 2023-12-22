import React from 'react'

import avatar from './images/avatar.png'
import { Link, Route, Routes } from 'react-router-dom'
import { Restaurants } from './pages/Restaurants'
import { NewRestaurant } from './pages/NewRestaurant'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { isLoggedIn, logout } from './auth'

export function App() {
  function handleLogout() {
    logout()

    window.location.assign('/')
  }

  return (
    <>
      <header>
        <ul>
          <li>
            <nav>
              <Link to="/new">
                <i className="fa fa-plus"></i> Restaurant
              </Link>
              {isLoggedIn() ? null : (
                <>
                  <Link to="/signin">Sign in</Link>
                  <Link to="/signup">Sign up</Link>
                </>
              )}
              {isLoggedIn() ? (
                <a
                  href="/"
                  className="link"
                  onClick={function (event) {
                    event.preventDefault()
                    handleLogout()
                  }}
                >
                  Sign out
                </a>
              ) : null}

              <p>Welcome back, Steveeeeeeeee!</p>
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
