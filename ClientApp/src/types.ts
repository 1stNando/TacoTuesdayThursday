import { CSSProperties } from 'react'

export interface CSSStarsProperties extends CSSProperties {
  '--rating': number
}

// Try to keep all your types in one place.
export type RestaurantType = {
  //    We make the id optional by adding a trailing ? to the name of the property.

  // This field is optional because we won't always have an id field. For example, when creating a new restaurant.
  id?: number
  name: string
  description: string
  address: string
  telephone: string
  reviews: ReviewType[]
}

export type ReviewType = {
  id?: number
  summary: string
  body: string
  stars: number
  createdAt?: string
  restaurantId: number
}

export type NewUserType = {
  fullName: string
  email: string
  password: string
}

export type APIError = {
  errors: Record<string, string[]>
  status: number
  title: string
  traceId: string
  type: string
}

//The first step is to add types. We'll need a type to hold the form information and we'll also need a type for the data that is returned from the login API. Then state to store the user and an error message...
export type LoginUserType = {
  email: string
  password: string
}
export type LoginSuccess = {
  token: string
  user: {
    id: number
    fullName: string
    email: string
  }
}
