import React, { useState } from 'react'
import { CSSStarsProperties, NewReviewType, RestaurantType } from '../types'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import format from 'date-fns/format'
import { getUserId, isLoggedIn } from '../auth'
import { Stars } from '../components/Stars'
import {
  NullRestaurant,
  handleDelete,
  loadOneRestaurant,
  submitNewReview,
} from '../api'

export function Restaurant() {
  // Define the date format to be used when submitting new reviews.
  const dateFormat = `EEEE, MMMM do, yyyy 'at' h:mm aaa`
  const history = useNavigate()

  const { id } = useParams<{ id: string }>()

  // define the shape of the state we need to track for new reviews to be sent.
  const [newReview, setNewReview] = useState<NewReviewType>({
    id: undefined,
    body: '',
    stars: 5,
    summary: '',
    createdAt: new Date(),
    restaurantId: Number(id),
  })

  const { refetch, data: restaurant = NullRestaurant } =
    useQuery<RestaurantType>(['one-restaurant', id], () =>
      loadOneRestaurant(id)
    )

  // This clears out the new restaurant fields upon submission.
  const createNewReview = useMutation(submitNewReview, {
    onSuccess: function () {
      refetch()
      setNewReview({
        ...newReview,
        body: '',
        stars: 5,
        summary: '',
      })
    },
  })

  // Delete restaurant
  const deleteRestaurant = useMutation(handleDelete, {
    onSuccess: function () {
      history('/')
    },
    onError: function () {
      console.log('ooops, error')
    },
  })

  // Write a function to deal with text field change in new review
  function handleNewReviewTextFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const name = event.target.name
    const value = event.target.value

    setNewReview({ ...newReview, [name]: value })
  }

  function handleStarRadioButton(newStars: number) {
    setNewReview({ ...newReview, stars: newStars })
  }

  //Delete review UNDER CONSTRUCTION! need to work on it further///////////////////
  // const [restaurant, setRestaurant] = useState({
  //   name: '',
  //   description: '',
  //   address: '',
  //   reviews: [],
  // })

  // Delete a Review
  // async function handleDeleteReview(event, reviewId) {
  //   event.preventDefault()

  //   await fetch(`/api/Reviews/${reviewId}`, {
  //     method: 'DELETE',
  //     headers: { 'content-type': 'application/json', ...authHeader() },
  //   })

  //   const response = await fetch(`/api/Restaurants/${id}`)

  //   if (response.ok) {
  //     const apiData = await response.json()

  //     setRestaurant(apiData)
  //   }
  // }

  return (
    // This is the view of  ONE RESTAURANT, showing the reviews and star ratings. SINGLE VIEW PAGE.
    <main className="page">
      <nav>
        <Link to="/">
          <i className="fa fa-home"></i>
        </Link>
        <h2>{restaurant.name}</h2>
      </nav>
      <p>
        <Stars restaurant={restaurant} />({restaurant.reviews.length})
      </p>
      <address>{restaurant.address}</address>
      <p>
        {restaurant.photoURL ? (
          <img alt="Restaurant Photo" width={200} src={restaurant.photoURL} />
        ) : null}
      </p>

      {/* Delete Restaurant */}
      {restaurant.userId === getUserId() ? (
        <>
          <p>
            <button
              onClick={function (event) {
                event.preventDefault()

                deleteRestaurant.mutate(restaurant.id)
              }}
            >
              Delete!
            </button>
          </p>
          <p>
            <Link className="button" to={`/restaurants/${restaurant.id}/edit`}>
              Edit
            </Link>
          </p>
        </>
      ) : null}

      <hr />
      <h3>Reviews for {restaurant.name}</h3>
      <ul className="reviews">
        {restaurant.reviews.map((review) => (
          <li key={review.id}>
            <div className="author">
              {review.user.fullName} said: <em>{review.summary}</em>
            </div>
            <div className="body">
              <p>{review.body}</p>
            </div>
            <div className="meta">
              <span
                className="stars"
                style={{ '--rating': review.stars } as CSSStarsProperties}
                aria-label={`Star rating of this location is ${review.stars} out of 5.`}
              ></span>
              <time>
                {review.createdAt
                  ? format(new Date(review.createdAt), dateFormat)
                  : null}
              </time>
            </div>

            {/* Review Delete */}
            {review.user.id === getUserId() ? (
              <div>
                <button
                  className="small"
                  // In the onClick, we send both the event (to prevent any default behavior) and the currently displayed review id.
                  // onClick={function (event) {
                  //   handleDeleteReview(event, review.id)
                  // }}
                >
                  Delete review
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {isLoggedIn() ? (
        <>
          <h3>Enter your own review</h3>
          <form
            onSubmit={function (event) {
              event.preventDefault()
              createNewReview.mutate(newReview)
            }}
          >
            <p className="form-input">
              <label htmlFor="summary">Summary</label>
              <input
                type="text"
                name="summary"
                value={newReview.summary}
                onChange={handleNewReviewTextFieldChange}
              />
              <span className="note">
                Enter a brief summary of your review. Example:{' '}
                <strong>Great food, good prices.</strong>
              </span>
            </p>
            <p className="form-input">
              <label htmlFor="body">Review</label>
              <textarea
                name="body"
                value={newReview.body}
                onChange={handleNewReviewTextFieldChange}
              ></textarea>
            </p>
            <div className="rating">
              <input
                id="star-rating-1"
                type="radio"
                name="stars"
                value="1"
                checked={newReview.stars === 1}
                onChange={() => handleStarRadioButton(1)}
              />
              <label htmlFor="star-rating-1">1 star</label>
              <input
                id="star-rating-2"
                type="radio"
                name="stars"
                value="2"
                checked={newReview.stars === 2}
                onChange={() => handleStarRadioButton(2)}
              />
              <label htmlFor="star-rating-2">2 stars</label>
              <input
                id="star-rating-3"
                type="radio"
                name="stars"
                value="3"
                checked={newReview.stars === 3}
                onChange={() => handleStarRadioButton(3)}
              />
              <label htmlFor="star-rating-3">3 stars</label>
              <input
                id="star-rating-4"
                type="radio"
                name="stars"
                value="4"
                checked={newReview.stars === 4}
                onChange={() => handleStarRadioButton(4)}
              />
              <label htmlFor="star-rating-4">4 stars</label>
              <input
                id="star-rating-5"
                type="radio"
                name="stars"
                value="5"
                checked={newReview.stars === 5}
                onChange={() => handleStarRadioButton(5)}
              />
              <label htmlFor="star-rating-5">5 stars</label>

              <div className="star-rating">
                <label
                  htmlFor="star-rating-1"
                  aria-label="1 star"
                  title="1 star"
                ></label>
                <label
                  htmlFor="star-rating-2"
                  aria-label="2 stars"
                  title="2 stars"
                ></label>
                <label
                  htmlFor="star-rating-3"
                  aria-label="3 stars"
                  title="3 stars"
                ></label>
                <label
                  htmlFor="star-rating-4"
                  aria-label="4 stars"
                  title="4 stars"
                ></label>
                <label
                  htmlFor="star-rating-5"
                  aria-label="5 stars"
                  title="5 stars"
                ></label>
              </div>
            </div>
            <p>
              <input type="submit" value="Submit" />
            </p>
          </form>
        </>
      ) : null}
    </main>
  )
}
