import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import { useMask } from '@react-input/mask';
import { cloneElement, forwardRef, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { order, service } from '@service';
import { OrderValidationSchema } from '@validation';
import Notification from "@notification"

const Fade = forwardRef(function Fade(props, ref) {
	const {
		children,
		in: open,
		onClick,
		onEnter,
		onExited,
		ownerState,
		...other
	} = props;
	const style = useSpring({
		from: { opacity: 0 },
		to: { opacity: open ? 1 : 0 },
		onStart: () => {
			if (open && onEnter) {
				onEnter(null, true);
			}
		},
		onRest: () => {
			if (!open && onExited) {
				onExited(null, true);
			}
		},
	});

	return (
		<animated.div ref={ref} style={style} {...other}>
			{cloneElement(children, { onClick })}
		</animated.div>
	);
});

Fade.propTypes = {
	children: PropTypes.element.isRequired,
	in: PropTypes.bool,
	onClick: PropTypes.any,
	onEnter: PropTypes.func,
	onExited: PropTypes.func,
	ownerState: PropTypes.any,
};

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function OrdersModal({ open, handleClose, item }) {
	const [data, setData] = useState([]);
	const getData = async () => {
		try {
			const response = await service.get();
			if (response.status === 200 && response?.data?.services) {
				setData(response?.data?.services);
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getData();
	}, []);
	const inputRef = useMask({
		mask: "+998 (__) ___-__-__",
		replacement: { _: /\d/ },
	});
	const handleSubmit = async (values) => {
		console.log(values);
		const client_phone_number = values.client_phone_number.replace(/\D/g, "");
		const payload = { ...values, id: item?.id, client_phone_number: `+${client_phone_number}` };
		try {
			if (!item || !item.id) {
				// Add new service
				const response = await order.create(payload);
				if (response.status === 201) {
					setTimeout(() => {
						window.location.reload();
					}, 500);
					Notification({ title: "Order added", type: 'success' });
				}
			} else {
				// Update existing service
				const update_payload = {
					...payload,
					id: item.id,
					client_id: item.client_id, // Make sure to include client_id
					status: values.status || item.status,
				};
				const response = await order.update(update_payload);
				if (response.status === 200) {
					setTimeout(() => {
						window.location.reload();
					}, 500);
					Notification({ title: "Order updated", type: 'success' });
				}
			}
		} catch (error) {
			console.log(error);
			Notification({ title: "Error", type: 'error' });
		}
	};

	return (
		<>
		<ToastContainer/>
			<div>
				<Modal
					aria-labelledby="spring-modal-title"
					aria-describedby="spring-modal-description"
					open={open}
					onClose={handleClose}
					closeAfterTransition
					slots={{ backdrop: Backdrop }}
					slotProps={{
						backdrop: {
							TransitionComponent: Fade,
						},
					}}
				>
					<Fade in={open}>
						<Box sx={modalStyle}>
							<Typography id="spring-modal-title" variant="h5" sx={{ marginY: "10px", textAlign: "center" }} component="h2">
								{item?.id ? "Edit Service" : "Create Service"}
							</Typography>
							<Formik
								initialValues={{
									client_full_name: item?.client_name || "",
									client_phone_number: item?.client_phone_number || "",
									amount: item?.amount || "",
									service_id: item?.service_id || "",
									status: item?.status || "pending",
								}}
								validationSchema={OrderValidationSchema}
								onSubmit={handleSubmit}
							>
								{({ isSubmitting, setFieldValue }) => (
									<Form className='flex flex-col gap-2'>
										<Field
											as={TextField}
											fullWidth
											label="Fullname"
											variant="outlined"
											type="text"
											name="client_full_name"
										/>
										<ErrorMessage name="client_full_name" component="div" className="text-red-600" />
										<Field
											as={TextField}
											fullWidth
											label="Phone Number"
											variant="outlined"
											type="text"
											name="client_phone_number"
											inputRef={inputRef}
										/>
										<ErrorMessage name="client_phone_number" component="div" style={{ color: 'red' }} />
										<Field
											name="service_id"
											type="text"
											as={Select}
											label="Service"
											fullWidth
											margin="normal"
											variant="outlined"
											helperText={
												<ErrorMessage
													name="service_id"
													component="p"
													className="text-[red] text-[15px]"
												/>
											}
											onChange={(e) => setFieldValue("service_id", e.target.value)}
										>
											{data.map((service, index) => (
												<MenuItem key={index} value={service.id}>{service.name}</MenuItem>
											))}
										</Field>
										<ErrorMessage name="service_id" component="div" className="text-red-600" />
										<Field
											as={TextField}
											fullWidth
											label="Amount"
											variant="outlined"
											type="number"
											name="amount"
										/>
										<ErrorMessage name="amount" component="div" className="text-red-600" />
										<Field
											name="status"
											type="text"
											as={Select}
											label="Order Status"
											fullWidth
											margin="normal"
											variant="outlined"
											helperText={
												<ErrorMessage
													name="status"
													component="p"
													className="text-[red] text-[15px]"
												/>
											}
											onChange={(e) => setFieldValue("status", e.target.value)}
										>
											<MenuItem value="pending">Pending</MenuItem>
											<MenuItem value="in_process">In process</MenuItem>
											<MenuItem value="taken">Taken</MenuItem>
											<MenuItem value="done">Done</MenuItem>
										</Field>
										<ErrorMessage name="status" component="div" className="text-red-600" />
										<Button
											variant="contained"
											disableElevation
											type="submit"
											fullWidth
											disabled={isSubmitting}
										>
											Save
										</Button>
									</Form>
								)}
							</Formik>
						</Box>
					</Fade>
				</Modal>
			</div>
		</>
	);
}
