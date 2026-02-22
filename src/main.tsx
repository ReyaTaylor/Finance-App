import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import { Layout } from './layouts/Layout'
import DashboardPage from './app/dashboard'
import { BudgetPage } from './app/budget'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: 'dashboard',
        Component: DashboardPage,
      },
      {
        path: 'budget',
        Component: BudgetPage,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
