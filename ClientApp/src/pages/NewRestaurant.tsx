import React, { useState } from 'react'
import { RestaurantType } from '../types'

export function NewRestaurant() {
  // Day 2 start: Create a state to track a new restaurant creation.
  const [newRestaurant, setNewRestaurant] = useState<RestaurantType>({
    id: undefined,
    name: '',
    description: '',
    address: '',
    telephone: '',
  })

  return (
    <main className="page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Add a Restaurant</h2>
      </nav>
      <form action="#">
        <p className="form-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={newRestaurant.name}
            onChange={handleName}
          />
        </p>
        <p className="form-input">
          <label htmlFor="description">Description</label>
          <textarea name="description"></textarea>
          <span className="note">
            Enter a brief description of the restaurant.
          </span>
        </p>
        <p className="form-input">
          <label htmlFor="name">Address</label>
          <textarea name="address"></textarea>
        </p>
        <p className="form-input">
          <label htmlFor="name">Telephone</label>
          <input type="tel" name="telephone" />
        </p>
        <p className="form-input">
          <label htmlFor="picture">Picture</label>
          <input type="file" name="picture" />
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>
    </main>
  )
}
