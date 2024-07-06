import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "@service";
import { ValidationSignIn } from "@validation";
import Notification from '@notification';

const Index = () => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const moveRegister = () => {
		navigate("/sign-up");
	};
	const moveForgotPassword = () =>{
		navigate("/forgot-password")
	}

	const handleSubmit = async (values, { setSubmitting }) => {
		try {
			const response = await auth.sign_in(values);
			if (response.status === 200) {
				localStorage.setItem("access_token", response?.data?.access_token);
				Notification({title: "Success", type: 'success'})
				setTimeout(() => {
          navigate("/main");
        }, 2500);
			}
		} catch (error) {
			console.log(error);
			Notification({title: "Error", type: 'error'})
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
		<ToastContainer/>
			<div className="w-full h-screen flex items-center justify-center">
				<div className="w-full sm:w-[600px] p-5">
					<h1 className='text-center my-6 text-[50px]'>Login</h1>
					<Formik
						initialValues={{
							email: '',
							password: ''
						}}
						validationSchema={ValidationSignIn}
						onSubmit={handleSubmit}
					>
						{({ isSubmitting }) => (
							<Form className='flex flex-col gap-2'>
								<Field
                  as={TextField}
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                />
								<ErrorMessage name="email" component="div" className="text-red-600" />
								<Field
                  as={TextField}
                  fullWidth
									type={showPassword ? "text" : "password"}
                  id="password"
                  label="Password"
                  variant="outlined"
                  name="password"
									InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
								<ErrorMessage name="password" component="div" className="text-red-600" />
								<div className='flex align-center justify-between'>
								<p className="cursor-pointer text-blue-600" onClick={moveRegister}>Register?</p>
								<p className="cursor-pointer text-blue-600" onClick={moveForgotPassword}>Forgot Password?</p>
								</div>
								<Button
									variant="contained"
									disableElevation
									type="submit"
									fullWidth
									disabled={isSubmitting}
								>
									Sign In
								</Button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</>
	);
};

export default Index;
