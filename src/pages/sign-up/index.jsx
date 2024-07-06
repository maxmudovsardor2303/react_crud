import { IconButton, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useMask } from "@react-input/mask";
import {SignUpModal} from '@modal';
import { auth } from "@service";
import { ValidationSignUp } from "@validation";
import Notification from '@notification';

const Register = () => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useMask({
    mask: "+998 (__) ___-__-__",
    replacement: { _: /\d/ },
  });

  const handleSubmit = async (values) => {
    const phone_number = values.phone_number.replace(/\D/g, "");
    const payload = { ...values, phone_number: `+${phone_number}` };
    try {
      const response = await auth.sign_up(payload);
      if (response.status === 200) {
        setOpen(true);
        localStorage.setItem("email", values.email);
        Notification({ title: "Code has been sent", type: 'success' });
      }
    } catch (error) {
      console.log(error);
      Notification({ title: "Registration failed", type: 'error' });
    }
  };

  return (
    <>
      <ToastContainer />
      <SignUpModal open={open} handleClose={() => setOpen(false)} />
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full sm:w-[600px] p-5">
          <h1 className="text-center my-6 text-[50px]">Register</h1>
          <Formik
            initialValues={{ email: '', full_name: '', password: '', phone_number: '' }}
            validationSchema={ValidationSignUp}
            onSubmit={handleSubmit}
            id="submit"
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-2">
                <Field
                  as={TextField}
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                />
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  fullWidth
                  id="full_name"
                  label="Full Name"
                  variant="outlined"
                  type="text"
                  name="full_name"
                />
                <ErrorMessage name="full_name" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  label="Password"
                  variant="outlined"
                  name="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />

                <Field
                  as={TextField}
                  fullWidth
                  id="phone_number"
                  label="Phone Number"
                  variant="outlined"
                  type="text"
                  name="phone_number"
                  inputRef={inputRef}
                />
                <ErrorMessage name="phone_number" component="div" style={{ color: 'red' }} />

                <Button variant="contained" disableElevation type="submit" fullWidth disabled={isSubmitting}>
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
