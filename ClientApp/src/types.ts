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
}
