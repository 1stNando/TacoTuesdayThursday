import React from 'react'
import tacoTuesday from '../images/taco-tuesday.svg'
import map from '../images/map.png'
import { CSSStarsProperties, RestaurantType } from '../types'
//import axios from 'axios'
import { useQuery } from 'react-query'

export function Restaurants() {
  //const [restaurants, setRestaurants] = useState([])

  //you useEffect and Fetch instead.
  //Part where USE REACT QUERY: to load all restaurants.
  const { data: restaurants = [] } = useQuery<RestaurantType[]>(
    'restaurants',
    async function () {
      const response = await fetch('/api/restaurants')

      return response.json()
    }
  )

  console.log({ restaurants })

  // Here is the API fetch by way of useEffect and Axios. Instead of the useQuery method. Having issues with it.
  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await axios.get(
  //       'https://one-list-api.herokuapp.com/items?access_token=cohort42'
  //     )
  //     if (response.status === 200) {
  //       console.log(response.data)
  //     }
  //     fetchData()
  //   }
  // }, [])

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
            <li key={restaurant.id}>
              <h2>{restaurant.name}</h2>
              <p>
                <span
                  className="stars"
                  style={{ '--rating': 4.7 } as CSSStarsProperties}
                  aria-label="Star rating of this location is 4.7 out of 5."
                ></span>
                (2,188)
              </p>
              <address>{restaurant.address}</address>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
