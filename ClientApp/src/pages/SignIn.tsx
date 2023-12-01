import React, { useState } from 'react'
import { APIError, LoginSuccess, LoginUserType } from '../types'
import { recordAuthentication } from '../auth'
import { useMutation } from 'react-query'

export function SignIn() {
  const [errorMessage, setErrorMessage] = useState('')

  const [user, setUser] = useState<LoginUserType>({
    email: '',
    password: '',
  })

  function handleStringFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedUser = { ...user, [fieldName]: value }

    setUser(updatedUser)
  }

  // Adding the data type to be returned is very useful Promise<LoginSuccess>
  async function loginUser(user: LoginUserType): Promise<LoginSuccess> {
    const response = await fetch('/api/Sessions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(user),
    })

    if (response.ok) {
      return response.json()
    } else {
      throw await response.json()
    }
  }

  // Mutation:
  const loginUserMutation = useMutation(loginUser, {
    onSuccess: function (apiResponse: LoginSuccess) {
      // TODO: record the authentication information we receive

      recordAuthentication(apiResponse)

      window.location.assign('/')
    },
    onError: function (error: APIError) {
      setErrorMessage(Object.values(error.errors).join(' '))
    },
  })
  //////////////////////
  return (
    <main className="page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Sign In</h2>
      </nav>
      <form
        onSubmit={function (event) {
          event.preventDefault()

          loginUserMutation.mutate(user)
        }}
      >
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <p className="form-input">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleStringFieldChange}
          />
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>
    </main>
  )
}
