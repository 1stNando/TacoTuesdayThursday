import React from 'react'
import avatar from './images/avatar.png'
import { Link, Route, Routes } from 'react-router-dom'
import { Restaurants } from './pages/Restaurants'
import { NewRestaurant } from './pages/NewRestaurant'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { getUser, isLoggedIn, logout } from './auth'

export function App() {
  return (
    <>
      <header>
        <nav>{isLoggedIn() ? <LoggedInNav /> : <SignedOutNav />}</nav>
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

function LoggedInNav() {
  const user = getUser()

  function handleLogout() {
    logout()

    window.location.assign('/')
  }
  return (
    <ul>
      <li>
        <nav>
          <Link to="/new">
            <i className="fa fa-plus"></i> Restaurant
          </Link>
          <a
            href="/new"
            className="link"
            onClick={function (event) {
              event.preventDefault()
              handleLogout()
            }}
          >
            Sign Out
          </a>
          <p>Welcome back, {user.fullName}!</p>
        </nav>
      </li>
      <li className="avatar">
        <img src={avatar} alt={`${user.fullName}`} height="64" width="64" />
      </li>
    </ul>
  )
}

function SignedOutNav() {
  return (
    <ul>
      <li>
        <nav>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </li>
    </ul>
  )
}
