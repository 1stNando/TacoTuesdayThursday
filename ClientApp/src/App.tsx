import React from 'react'

import avatar from './images/avatar.png'
import { Link, Route, Routes } from 'react-router-dom'
import { Restaurants } from './pages/Restaurants'
import { NewRestaurant } from './pages/NewRestaurant'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { getUser, isLoggedIn, logout } from './auth'

export function App() {
  function handleLogout() {
    logout()

    window.location.assign('/')
  }

  //To determine the user, we'll add a call to getUser from auth.js
  const user = getUser()

  return (
    <>
      <header>
        <ul>
          <li>
            <nav>
              {isLoggedIn() ? (
                <Link to="/new">
                  <i className="fa fa-plus"></i> Restaurant
                </Link>
              ) : null}

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

              {isLoggedIn() ? <p>Welcome back, {user.fullName}!</p> : null}
            </nav>
          </li>
          {isLoggedIn() ? (
            <li className="avatar">
              <img
                src={avatar}
                alt={`${user.fullName}`}
                height="64"
                width="64"
              />
            </li>
          ) : null}
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
