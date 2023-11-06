import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.scss'
import { App } from './App'
import { Restaurants } from './pages/Restaurants'
import { NewRestaurant } from './pages/NewRestaurant'

const queryClient = new QueryClient()

const routingObject = createBrowserRouter([
  {
    path: '/',
    element: <Restaurants />,
  },
  {
    path: '/new',
    element: <NewRestaurant />,
  },
])

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routingObject} />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
