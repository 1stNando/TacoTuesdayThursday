import React from 'react'
import { RestaurantType } from '../types'
import { Link } from 'react-router-dom'
import { Stars } from './Stars'

type SingleRestaurantFromListProps = {
  restaurant: RestaurantType
}

export function SingleRestaurantFromList(props: SingleRestaurantFromListProps) {
  return (
    // This page is like an intermediary between the MAIN landing page and the detail specific "Restaurant" single view page.
    <li key={props.restaurant.id}>
      <h2>
        <Link to={`/restaurants/${props.restaurant.id}`}>
          {props.restaurant.name}
        </Link>
      </h2>
      <p>
        <Stars restaurant={props.restaurant} />
        {/* Dynamically display the number of reviews for this restaurant. */}(
        {props.restaurant.reviews.length})
      </p>
      <address>{props.restaurant.address}</address>
    </li>
  )
}
