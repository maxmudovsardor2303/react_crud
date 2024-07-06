import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Notification = (prop)=>{
    return toast(prop.title, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
			transition: Bounce,
        type: prop.type
    });
}

export default Notification