import PropTypes from 'prop-types';
import { Button, TextField, CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from '@react-spring/web';
import { cloneElement, forwardRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { auth } from '@service';
import Notification from '@notification';

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

export default function SignUpModal({ open, handleClose }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      code,
      email: localStorage.getItem("email")
    };
    try {
      const response = await auth.verify_code(payload);
      if (response.status === 201) {
        Notification({ title: "Verified", type: 'success' });
        setTimeout(() => {
          navigate("/");
        }, 2500);
      } else {
        Notification({ title: response.data.message || "Verification failed", type: 'error' });
      }
    } catch (error) {
      Notification({ title: error.response?.data?.message || "An error occurred", type: 'error' });
    } finally {
      setLoading(false);
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
                Enter verification code
              </Typography>
              <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <TextField
                  fullWidth
                  id="fullWidth"
                  onChange={(e) => setCode(e.target.value)}
                  label="Code"
                  variant="outlined"
                  type="text"
                  required
                />
                <Button variant="contained" type='submit' fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Verify"}
                </Button>
              </form>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
}
