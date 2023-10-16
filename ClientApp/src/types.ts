import { CSSProperties } from 'react'

export interface CSSStarsProperties extends CSSProperties {
  '--rating': number
}

// Try to keep all your types in one place.
export type RestaurantType = {
  id: number
  name: string
  description: string
  address: string
  telephone: string
}
