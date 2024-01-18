import React, { useState } from 'react'
import tacoTuesday from '../images/taco-tuesday.svg'

import { RestaurantType } from '../types'
//import map from '../images/map.png'

//import axios from 'axios'
import { useQuery } from 'react-query'
import { SingleRestaurantFromList } from '../components/SingleRestaurantFromList'

//Maps
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// Securely imports our secret token.
const api_key = import.meta.env.VITE_APP_MAPBOX_TOKEN

export function Restaurants() {
  // Start of search bar abilities.
  const [filterText, setFilterText] = useState('')

  //Part where USE REACT QUERY: to load all restaurants. This LOADS data at start.
  // NOTE: In this code const { data: restaurants = [] } = we are destructuring the return of react-query to get the data property and renaming it restaurants.
  const { data: restaurants = [] } = useQuery<RestaurantType[]>(
    ['restaurants', filterText],
    async function () {
      const response = await fetch(
        filterText.length === 0
          ? '/api/restaurants'
          : `/api/restaurants?filter=${filterText}`
      )

      // Do not await here... We want to return the promise.

      return response.json()
    }
  )

  return (
    // This is the main LANDING PAGE, with the search bar at the top, a map of city, and list of our database.

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
        {/* {<img alt="Example Map" src={map} />} */}
        {
          <Map
            mapboxAccessToken={api_key}
            initialViewState={{
              longitude: -82.66090611749074,
              latitude: 27.77101804911986,
              zoom: 9,
            }}
            style={{ width: 600, height: 400 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          />
        }
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
