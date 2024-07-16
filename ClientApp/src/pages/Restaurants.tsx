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

// Securely imports our secret token. MAPBOX service.
const api_key = import.meta.env.VITE_APP_MAPBOX_TOKEN
//const api_key2 = import.meta.env.VITE_APP_MAPBOX_TOKEN2

// react-map-gl
// import * as turf from '@turf/turf'

// const GEOFENCE = turf.circle([27.77101804911986, -82.66090611749074], 5, {
//   units: 'miles',
// })

export function Restaurants() {
  // Start of search bar abilities.
  const [filterText, setFilterText] = useState('')

  //Part where USE REACT QUERY: to load all restaurants. This LOADS data at start.
  // NOTE: In this code const { data: restaurants = [] } = we are destructuring with default value, the return of react-query to get the data property and renaming it restaurants.
  //Query Key Dependency: The query key ['restaurants', filterText] includes filterText. react-query uses this key to cache and track the query. Whenever filterText changes, the query is re-run.
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
        {
          <Map
            style={{ width: 400, height: 300 }}
            mapboxAccessToken={api_key}
            initialViewState={{
              latitude: 27.77101804911986,
              longitude: -82.66090611749074,
              zoom: 8,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          />
        }
      </section>

      <ul className="results">
        {/* Logic added directly below to dynamically display list. "restaurants" is the data object we obtained from the useQuery data fetch. Mapping Over Restaurants: The restaurants array (fetched data) is mapped over, and for each restaurant, a SingleRestaurantFromList component is rendered. */}
        {restaurants.map(function (restaurant) {
          return (
            <SingleRestaurantFromList
              key={restaurant.id}
              restaurant={restaurant}
            />
          )
        })}
      </ul>

      {/* <div className="map2">
        Map #2!!!
        <Map
          style={{ width: 400, height: 300, marginLeft: 1000 }}
          mapboxAccessToken={api_key2}
          initialViewState={{
            latitude: -74.5,
            longitude: 40,
            zoom: 8,
          }}
        />
      </div> */}
    </main>
  )
}
