import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSpring, animated } from '@react-spring/web';
import { cloneElement, forwardRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { service } from '@service';
import { ServiceValidationSchema } from '@validation';
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

export default function ServiceModal({ open, handleClose, item }) {
	const handleSubmit = async (values) => {
		const payload = { ...values, id: item?.id };

		try {
			if (!item || !item.id) {
				// Add new service
				const response = await service.create(payload);
				if (response.status === 201) {
					setTimeout(() => {
						window.location.reload();
					}, 500);
					Notification({ title: "Service added", type: 'success' });
				}
			} else {
				// Update existing service
				const response = await service.update(payload);
				if (response.status === 200) {
					setTimeout(() => {
						window.location.reload();
					}, 500);
					Notification({ title: "Service updated", type: 'success' });
				}
			}
		} catch (error) {
			console.log(error);
			Notification({ title: "Error", type: 'error' });
		}
	};

	return (
		<>
			<ToastContainer />
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
									name: item?.name || "",
									price: item?.price || ""
								}}
								validationSchema={ServiceValidationSchema}
								onSubmit={handleSubmit}
							>
								{({ isSubmitting }) => (
									<Form className='flex flex-col gap-2'>
										<Field
											as={TextField}
											fullWidth
											label="Name"
											variant="outlined"
											type="text"
											name="name"
										/>
										<ErrorMessage name="name" component="div" className="text-red-600" />
										<Field
											as={TextField}
											fullWidth
											label="Price"
											variant="outlined"
											name="price"
											type="number"
										/>
										<ErrorMessage name="price" component="div" className="text-red-600" />
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
