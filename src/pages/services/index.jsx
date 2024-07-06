import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ServiceTable } from '@ui';
import { ServiceModal } from '@modal';
import { useEffect, useState } from 'react';
import {service} from "@service"

export default function Index() {
	const [open, setOpen] = useState(false)
	const [data, setData] = useState([])
	const getData = async ()=>{
		const responce = await service.get()
		if (responce.status === 200 && responce?.data?.services) {
			setData(responce?.data?.services)
		}
	}
	useEffect(()=>{
		getData()
	}, [])
	return (
		<>
		<ServiceModal open={open} handleClose={()=>setOpen(false)}/>
		<div className='w-full flex justify-between mb-3'>
		<TextField id="fullWidth" label="Search" variant="outlined" />
		<Button variant="contained" onClick={()=>setOpen(true)}>Buyurtma qo'shish</Button>
		</div>
		<ServiceTable data={data}/>
		</>
	);
}
