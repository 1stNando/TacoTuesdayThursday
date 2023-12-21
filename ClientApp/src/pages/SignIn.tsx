import React, { useState } from 'react'
import { APIError, LoginSuccess, LoginUserType } from '../types'
import { recordAuthentication } from '../auth'
import { useMutation } from 'react-query'

export function SignIn() {
  return (
    <main className="page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Sign In</h2>
      </nav>
      
        <p className="form-input">
          <label htmlFor="name">Email</label>
          
        </p>
        <p className="form-input">
          <label htmlFor="password">Password</label>
     
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>
    </main>
  )
}
