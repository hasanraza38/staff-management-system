import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Candidate from './pages/Candidate'
import Jobs from './pages/Jobs'
import Client from './pages/Client'
import Layout from './Layout'


const router = createBrowserRouter([
    {
        path: '',
        element: <Layout/>,
        errorElement: <h1>No screen found</h1>,
        children: [
            {
                path: '/',
                element: <Dashboard/>
            },
            {
                path: '/candidates',
                element: <Candidate/>
            },
          
            {
                path: '/job',
                element: <Jobs/>
            },
            {
                path: '/client',
                element: <Client/>
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)