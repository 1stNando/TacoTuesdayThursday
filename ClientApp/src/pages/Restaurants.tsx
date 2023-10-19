import React, { useState } from 'react'
import tacoTuesday from '../images/taco-tuesday.svg'
import map from '../images/map.png'
import { RestaurantType } from '../types'
//import axios from 'axios'
import { useQuery } from 'react-query'
import { SingleRestaurantFromList } from '../components/SingleRestaurantFromList'

export function Restaurants() {
  // Start of search bar abilities.
  const [filterText, setFilterText] = useState('')

  //Part where USE REACT QUERY: to load all restaurants. This LOADS data at start.
  const { data: restaurants = [] } = useQuery<RestaurantType[]>(
    ['restaurants', filterText],
    async function () {
      // Example of a longer way to approach.
      // let url = '/api/restaurants'

      // if (filterText.length !== 0) {
      //   url = `/api/restaurants?filter=${filterText}`
      // }
      const url =
        filterText.length === 0
          ? '/api/restaurants'
          : `/api/restaurants?filter=${filterText}`

      const response = await fetch(url)

      // Do not await here... We want to return the promise.
      return response.json()
    }
  )

  console.log({ restaurants })

  return (
    <main className="home">
      <h1>
        <img src={tacoTuesday} alt="Taco Tuesday" />
      </h1>
      <form className="search">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={function (event) {
            setFilterText(event.target.value)
          }}
        />
      </form>

      <section className="map">
        <img alt="Example Map" src={map} />
      </section>

      <ul className="results">
        {/* Logic added directly below to dynamically display list of restaurants. */}
        {restaurants.map(function (restaurant) {
          return (
            <SingleRestaurantFromList
              key={restaurant.id}
              restaurant={restaurant}
            />
          )
        })}
      </ul>
    </main>
  )
}
