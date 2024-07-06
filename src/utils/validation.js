import * as Yup from 'yup';
//=========== AUTH ========== //

export const ValidationSignUp = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	full_name: Yup.string().required('Required'),
	password: Yup.string()
		.min(8, 'Too Short!')
		.max(50, 'Too Long!')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/\d/, 'Password must contain at least one number')
		.matches(/[@$!%*?&:#]/, 'Password must contain at least one special character')
		.required('Required'),
	phone_number: Yup.string().min(19, "Invalid phone number").required('Phone is required')
});

export const ValidationSignIn = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string()
		.min(8, 'Too Short!')
		.max(50, 'Too Long!')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/\d/, 'Password must contain at least one number')
		.matches(/[@$!%*?&:#]/, 'Password must contain at least one special character')
		.required('Required'),
})

export const ValidationForgotPassword = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
})

export const updatePassValidationSchema = Yup.object().shape({
	code: Yup.string().required().trim()
});

//=========== SERVICE ========== //
export const ServiceValidationSchema = Yup.object().shape({
	name: Yup.string().required('Required'),
	price: Yup.string().required('Required'),
});

//=========== ORDER ========== //
export const OrderValidationSchema = Yup.object().shape({
	client_full_name: Yup.string().required('Required'),
	client_phone_number: Yup.string().min(19, "Invalid phone number").required('Phone is required'),
	service_id: Yup.string().required('Required'),
	amount: Yup.string().required('Required'),
	status: Yup.string().required('Required'),
});