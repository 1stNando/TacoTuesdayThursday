import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { App } from './App'

import { NewRestaurant } from './pages/NewRestaurant'
import { Restaurant } from './pages/Restaurant'

import './index.scss'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { EditRestaurant } from './pages/EditRestaurant'

//Instantiates the query client method we need to query the database.
const queryClient = new QueryClient()

const routingObject = createBrowserRouter([
  {
    path: '*',
    element: <App />,
  },
  {
    path: '/new',
    element: <NewRestaurant />,
  },
  {
    path: '/restaurants/:id',
    element: <Restaurant />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/restaurants/:id/edit',
    element: <EditRestaurant />,
  },
])

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routingObject} />
      {/* <App /> */}
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
