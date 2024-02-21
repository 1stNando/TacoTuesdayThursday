import { authHeader } from './auth'
import {
  LoginSuccess,
  LoginUserType,
  NewReviewType,
  NewUserType,
  RestaurantType,
} from './types'

// Null object Pattern
export const NullRestaurant: RestaurantType = {
  id: undefined,
  userId: 0,
  name: '',
  address: '',
  description: '',
  telephone: '',
  latitude: 0,
  longitude: 0,
  reviews: [],
  photoURL: '',
}

export async function loadOneRestaurant(id: string | undefined) {
  const response = await fetch(`/api/restaurants/${id}`)

  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

// Takes a review object and submits it to the API
//
// Returns a promise of the JSON response of the API
// when successful, throws the JSON response of the API
// when there is a failure.
export async function submitNewReview(review: NewReviewType) {
  // Calls fetch
  const response = await fetch(`/api/Reviews`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(review),
  })

  // If response is ok
  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

// Delete restaurant
export async function handleDelete(id: number | undefined) {
  // If we don't know the id, don't do anything.
  // This could happen because the restaurant might have an undefined id before it is loaded. In that case we don't want to call the API since the URL won't be correct.
  if (id === undefined) {
    return
  }
  const response = await fetch(`/api/Restaurants/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
  })

  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

// We will send new data to the API, returns a promise. Ties in with submitting form new restaurant.
export async function submitEditedRestaurant(
  restaurantToUpdate: RestaurantType
) {
  const response = await fetch(`/api/Restaurants/${restaurantToUpdate.id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(restaurantToUpdate),
  })

  // deals with logic to throw an error message if user tries to submit a new restaurant without the required fields.
  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

// We will send new data to the API, returns a promise. Ties in with submitting form new restaurant.
export async function submitNewRestaurant(restaurantToCreate: RestaurantType) {
  const response = await fetch('/api/Restaurants', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(restaurantToCreate),
  })

  // deals with logic to throw an error message if user tries to submit a new restaurant without the required fields.
  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

// Notice how we are defining the type expected. It takes the data typed in loginUser! Nice. It returns a: Promise<>.
export async function loginUser(user: LoginUserType): Promise<LoginSuccess> {
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

// Function to deal with 'POST' the new User created to the API.
export async function submitNewUser(newUser: NewUserType) {
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
