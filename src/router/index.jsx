import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import App from '../App';
import {SignIn, SignUp, Main, ForgotPassword, Dashboard, Orders, Services} from "@pages"
const Index = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path='/' element={<App/>}>
				<Route index element={<SignIn/>}/>
				<Route path='sign-up' element={<SignUp/>}/>
				<Route path='forgot-password' element={<ForgotPassword/>}/>
				<Route path='main/*' element={<Main/>}>
					<Route index element={<Dashboard/>}/>
					<Route path='orders' element={<Orders/>}/>
					<Route path='services' element={<Services/>}/>
				</Route>
			</Route>
		)
	)
	return <RouterProvider router={router}/>
}

export default Index
