import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import {ServiceModal} from "@modal"
import {service} from "@service"
import Notification from "@notification"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
		backgroundColor: theme.palette.common.white,
		color: theme.palette.text.primary,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

export default function Index({ data }) {
	const [edit, setEdit] = useState({})
	const [open, setOpen] = useState(false)
	const deleteItem = async(id) =>{
		try {
			const responce = await service.delete(id)
		if (responce.status === 200) {
			setTimeout(() => {
				window.location.reload();
			}, 500);
			Notification({ title: "Service deleted", type: 'success' });
		}
		} catch (error) {
			console.log(error);
			Notification({ title: "Error", type: 'error' });
		}
	}
	const editItem =(item)=>{
		setEdit(item)
		setOpen(true)
	}
	return (
		<>
		<ToastContainer/>
		<ServiceModal open={open} item={edit} handleClose={()=>setOpen(false)}/>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell>#</StyledTableCell>
							<StyledTableCell align="center">Mijoz Ismi</StyledTableCell>
							<StyledTableCell align="center">Price</StyledTableCell>
							<StyledTableCell align="center">Action</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((item, index) => (
							<StyledTableRow key={item.id}>
								<StyledTableCell component="th" scope="row">
									{index + 1}
								</StyledTableCell>
								<StyledTableCell align="center">{item.name}</StyledTableCell>
								<StyledTableCell align="center">{item.price}</StyledTableCell>
								<StyledTableCell align="center">
									<div className='flex gap-2 justify-center'>
										<Button
											variant='contained'
											sx={{'&:hover': { bgcolor: 'blue' } }}
											onClick={()=>editItem(item)}
										>
											<EditIcon />
										</Button>
										<Button
											variant='contained'
											sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
											onClick={()=>deleteItem(item.id)}
										>
											<DeleteOutlineOutlinedIcon />
										</Button>
									</div>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
