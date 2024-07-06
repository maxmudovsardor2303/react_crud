import HomeIcon from '@mui/icons-material/Home';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import ListAltIcon from '@mui/icons-material/ListAlt';

const routes = [
	{
		path: "/main",
		content: "Asosiy",
		icon: <HomeIcon/>
	},
	{
		path: "/main/orders",
		content: "Buyurtmalar",
		icon: <ListAltIcon/>
	},
	{
		path: "/main/services",
		content: "Xizmatlar",
		icon: <DryCleaningIcon/>
	},
];

export default routes;