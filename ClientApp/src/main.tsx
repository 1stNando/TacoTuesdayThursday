import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { App } from './App'

import { NewRestaurant } from './pages/NewRestaurant'
import { Restaurant } from './pages/Restaurant'

import './index.scss'

const queryClient = new QueryClient()

const routingObject = createBrowserRouter([
  {
    path: '/',
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
