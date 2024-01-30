import React, { useState } from 'react'
import { APIError, RestaurantType, UploadResponse } from '../types'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router'
import { authHeader } from '../auth'
import { useDropzone } from 'react-dropzone'

// We will send new data to the API, returns a promise. Ties in with submitting form new restaurant.
async function submitNewRestaurant(restaurantToCreate: RestaurantType) {
  const response = await fetch('/api/Restaurants', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(restaurantToCreate),
  })

  // deals with logic to throw an error message if user tries to submit a new restaurant without the required fields.
  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

export function NewRestaurant() {
  // 1:00:30 minute. Setting a state to track an error message upon required field input on new restaurant.
  const [errorMessage, setErrorMessage] = useState('')
  const history = useNavigate()

  // Dropzone message during uploading image.
  const [isUploading, setIsUploading] = useState(false)
  // Day 2 start: Create a state to track a new restaurant creation.
  const [newRestaurant, setNewRestaurant] = useState<RestaurantType>({
    id: undefined,
    name: '',
    description: '',
    address: '',
    telephone: '',
    reviews: [],
    photoURL: '',

    // latitude: undefined,
    // longitude: undefined,
  })

  // Submitting the form: useMutation takes in an object, and an optional ,{function} to execute after mutation. We wanted to useHistory to navigate back to the "home" page. But was unable to so far.
  const createNewRestaurant = useMutation(submitNewRestaurant, {
    onSuccess: function () {
      history('/')
    },
    onError: function (apiError: APIError) {
      const newMessage = Object.values(apiError.errors).join(' ')

      setErrorMessage(newMessage)
    },
  })

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    createNewRestaurant.mutate(newRestaurant)
  }

  // Making a more generic function to handle ANY change in the input field. The event will be of <HTMLInputElement | HTMLTextAreaElement>.
  // This works specifically with the <input type="text" name="name"> of our input forms. CLEVER example of input field formatting with an onChange on the textarea. By naming the inputs in this way.
  function handleStringFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedRestaurant = { ...newRestaurant, [fieldName]: value }

    setNewRestaurant(updatedRestaurant)
  }

  //Cloudinary
  async function uploadFile(fileToUpload: File) {
    // Create a formData object so we can send this
    // to the API that is expecting some form data.
    const formData = new FormData()

    // Append a field that is the form upload itself
    formData.append('file', fileToUpload)

    // Use fetch to send an authorization header and
    // a body containing the form data with the file
    const response = await fetch('/api/Uploads', {
      method: 'POST',
      headers: {
        Authorization: authHeader(),
      },
      body: formData,
    })

    if (response.ok) {
      return response.json()
    } else {
      throw 'Unable to upload image!'
    }
  }

  function onDropFile(acceptedFiles: File[]) {
    // Do something with the files
    const fileToUpload = acceptedFiles[0]
    console.log(fileToUpload)

    setIsUploading(true)

    uploadFileMutation.mutate(fileToUpload)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
  })

  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: function (apiResponse: UploadResponse) {
      const url = apiResponse.url

      setNewRestaurant({ ...newRestaurant, photoURL: url })
    },

    onError: function (error: string) {
      setErrorMessage(error)
    },

    //Dropzone message item.
    onSettled: function () {
      setIsUploading(false)
    },
  })

  //
  let dropZoneMessage = 'Drag a picture of the restaurant here to upload!'
  if (isUploading) {
    dropZoneMessage = 'Uploading now...'
  }
  if (isDragActive) {
    dropZoneMessage = 'Drop the files here ...'
  }
  // End of Cloudinary items.

  return (
    <main className="page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Add a Restaurant</h2>
      </nav>
      <form onSubmit={handleFormSubmit}>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <p className="form-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={newRestaurant.name}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={newRestaurant.description}
            onChange={handleStringFieldChange}
          ></textarea>
          <span className="note">
            Enter a brief description of the restaurant.
          </span>
        </p>
        <p className="form-input">
          <label htmlFor="name">Address</label>
          <textarea
            name="address"
            value={newRestaurant.address}
            onChange={handleStringFieldChange}
          ></textarea>
        </p>
        <p className="form-input">
          <label htmlFor="name">Telephone</label>
          <input
            type="tel"
            name="telephone"
            value={newRestaurant.telephone}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <div className="file-drop-zone">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {dropZoneMessage}
            </div>
          </div>
        </p>
        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>
    </main>
  )
}
