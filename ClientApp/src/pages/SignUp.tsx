import React, { useState } from 'react'
import { APIError, NewUserType } from '../types'
import { useNavigate } from 'react-router'
import { useMutation } from 'react-query'

// Function to deal with 'POST' the new User created to the API.
async function submitNewUser(newUser: NewUserType) {
  const response = await fetch('/api/Users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newUser),
  })

  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

export function SignUp() {
  //Add useHistory perhaps??(update uses useNavigate instead), to redirect the user after signing up
  const history = useNavigate()

  // Set states to track for the User model.
  const [errorMessage, setErrorMessage] = useState('')

  const [newUser, setNewUser] = useState<NewUserType>({
    fullName: '',
    email: '',
    password: '',
  })

  // Function to deal with user input changes to the fields for signing up.
  function handleStringFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.target.value
    const fieldName = event.target.name

    const updateUser = { ...newUser, [fieldName]: value }

    setNewUser(updateUser)
  }

  // Create a mutation to submit the new data of User created.
  const createUserMutation = useMutation(
    (newUser: NewUserType) => submitNewUser(newUser),
    {
      onSuccess: function () {
        history('/')
      },
      onError: function (error: APIError) {
        setErrorMessage(Object.values(error.errors).join('. '))
      },
    }
  )

  return (
    <main className="page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Sign Up</h2>
      </nav>

      <form
        onSubmit={function (event) {
          event.preventDefault()

          createUserMutation.mutate(newUser)
        }}
      >
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <p className="form-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="fullName"
            value={newUser.fullName}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={newUser.password}
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
