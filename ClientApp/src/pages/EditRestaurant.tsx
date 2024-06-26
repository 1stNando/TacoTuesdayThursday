import React, { useState } from 'react'
import {
  APIError,
  NewRestaurantType,
  RestaurantType,
  UploadResponse,
} from '../types'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router'
import { authHeader } from '../auth'
import { useDropzone } from 'react-dropzone'
import { loadOneRestaurant, submitEditedRestaurant } from '../api'

export function EditRestaurant() {
  const history = useNavigate()

  const [errorMessage, setErrorMessage] = useState('')

  // Dropzone message during uploading image.
  const [isUploading, setIsUploading] = useState(false)

  const [updatingRestaurant, setUpdatingRestaurant] =
    useState<NewRestaurantType>({
      id: undefined,
      userId: undefined,
      name: '',
      description: '',
      address: '',
      telephone: '',
      reviews: [],
      //Dropzone
      photoURL: '',

      latitude: undefined,
      longitude: undefined,
    })

  const { id } = useParams<{ id: string }>()

  // Use the query to load the existing restaurant
  // and when we get something back, call setUpdatedRestaurant to update our state.
  useQuery<RestaurantType>(
    ['one-restaurant', id],
    () => loadOneRestaurant(id),
    {
      onSuccess: function (restaurantBeingLoaded) {
        console.log('Loaded the restaurant!')

        setUpdatingRestaurant(restaurantBeingLoaded)
      },
    }
  )

  // Submitting the form: useMutation takes in an object, and an optional ,{function} to execute after mutation. We wanted to useHistory to navigate back to the "home" page. But was unable to so far.
  const updateTheRestaurant = useMutation(submitEditedRestaurant, {
    onSuccess: function () {
      history('/')
    },
    onError: function (apiError: APIError) {
      const newMessage = Object.values(apiError.errors).join(' ')

      setErrorMessage(newMessage)
    },
  })

  // Make a more generic function to handle ANY change in the input field. The event will be of <HTMLInputElement | HTMLTextAreaElement>.
  // This works specifically with the <input type="text" name="name"> of our input forms. CLEVER example of input field formatting with an onChange on the textarea. By naming the inputs in this way.
  function handleStringFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedRestaurant = { ...updatingRestaurant, [fieldName]: value }

    setUpdatingRestaurant(updatedRestaurant)
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

  //
  const uploadFileMutation = useMutation(uploadFile, {
    onSuccess: function (apiResponse: UploadResponse) {
      const url = apiResponse.url

      setUpdatingRestaurant({ ...updatingRestaurant, photoURL: url })
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
        <h2>Update the Restaurant</h2>
      </nav>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          updateTheRestaurant.mutate(updatingRestaurant)
        }}
      >
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <p className="form-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={updatingRestaurant.name}
            onChange={handleStringFieldChange}
          />
        </p>
        <p className="form-input">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={updatingRestaurant.description}
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
            value={updatingRestaurant.address}
            onChange={handleStringFieldChange}
          ></textarea>
        </p>
        <p className="form-input">
          <label htmlFor="name">Telephone</label>
          <input
            type="tel"
            name="telephone"
            value={updatingRestaurant.telephone}
            onChange={handleStringFieldChange}
          />
        </p>

        {updatingRestaurant.photoURL ? (
          <p>
            <img
              alt="Restaurant photo"
              width={200}
              src={updatingRestaurant.photoURL}
            />
          </p>
        ) : null}

        <p>
          {updatingRestaurant.photoURL ? (
            <button
              onClick={function (event) {
                event.preventDefault()

                setUpdatingRestaurant({ ...updatingRestaurant, photoURL: '' })
              }}
            >
              Remove photo
            </button>
          ) : null}
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
          <input type="submit" value="Submit changes" />
        </p>
      </form>
    </main>
  )
}
