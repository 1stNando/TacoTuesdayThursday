import React, { useState } from 'react'
import { RestaurantType } from '../types'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Restaurants } from './Restaurants'

// We will send new data to the API, returns a promise. Ties in with submitting form new restaurant.
async function submitNewRestaurant(restaurantToCreate: RestaurantType) {
  const response = await fetch('/api/Restaurants', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(restaurantToCreate),
  })

  return response.json()
}

export function NewRestaurant() {
  // Day 2 start: Create a state to track a new restaurant creation.
  const [newRestaurant, setNewRestaurant] = useState<RestaurantType>({
    id: undefined,
    name: '',
    description: '',
    address: '',
    telephone: '',
  })

  // history, minute 44:12 in second video.

  // Submitting the form: useMutation takes in an object, and an optional ,{function} to execute after mutation. We wanted to useHistory to navigate back to the "home" page. But was unable to so far.
  const createNewRestaurant = useMutation(submitNewRestaurant)

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    createNewRestaurant.mutate(newRestaurant)
  }

  // Making a more generic function to handle ANY change in the input field. The event will be of <HTMLInputElement | HTMLTextAreaElement>.
  // This works specifically with the <input type="text" name="name"> of our input forms. CLEVER example of input field formatting with an onChange on the textarea. By naming the inputs in this way.
  function handleStringFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedRestaurant = { ...newRestaurant, [fieldName]: value }

    setNewRestaurant(updatedRestaurant)
  }

  // This version is able to handle a number input field instead of a string. E.g: max capacity of restaurant.
  // function handleNumberFieldChange(
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) {
  //   const value = Number(event.target.value)
  //   const fieldName = event.target.name

  //   const updatedRestaurant = { ...newRestaurant, [fieldName]: value }

  //   setNewRestaurant(updatedRestaurant)
  // }

  return (
    <main className="page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Add a Restaurant</h2>
      </nav>
      <form onSubmit={handleFormSubmit}>
        <p className="form-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={newRestaurant.name}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={newRestaurant.description}
            onChange={handleStringFieldChange}
          ></textarea>
          <span className="note">
            Enter a brief description of the restaurant.
          </span>
        </p>
        <p className="form-input">
          <label htmlFor="name">Address</label>
          <textarea
            name="address"
            value={newRestaurant.address}
            onChange={handleStringFieldChange}
          ></textarea>
        </p>
        <p className="form-input">
          <label htmlFor="name">Telephone</label>
          <input
            type="tel"
            name="telephone"
            value={newRestaurant.telephone}
            onChange={handleStringFieldChange}
          />
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
