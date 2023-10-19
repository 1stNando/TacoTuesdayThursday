import React from 'react'
import tacoTuesday from '../images/taco-tuesday.svg'
import map from '../images/map.png'
import { RestaurantType } from '../types'
//import axios from 'axios'
import { useQuery } from 'react-query'
import { SingleRestaurantFromList } from '../components/SingleRestaurantFromList'

export function Restaurants() {
  //???const [restaurants, setRestaurants] = useState([])

  //Part where USE REACT QUERY: to load all restaurants. This LOADS data at start.
  const { data: restaurants = [] } = useQuery<RestaurantType[]>(
    'restaurants',
    async function () {
      const response = await fetch('/api/restaurants')

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
        <input type="text" placeholder="Search..." />
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
