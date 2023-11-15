import { AppBar, Dialog, IconButton, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography, ThemeProvider, createTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import axios from "axios"
import configData from "../config.json";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formTheme = createTheme({
  palette:{
    primary: {
      main: "#BE1D60", // Change this to your desired primary color
    },
    text:{
      main:"#000000"
    }
  }
})

export default function AddGuestDialog({open,onClose}) {
  const [rows, setRows] = useState([])

  useEffect(()=>{
    axios.get(`${configData.SERVER_URL}/api/user/getGuests`)
    .then((response) => {
      console.log("response data",response.data)
      setRows(response.data.data)
    }
    ).catch((err)=>{
      console.log("there was an error")
    })
  },[])  


  const handleClose = () => {
    onClose(false)
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Guest Visit
          </Typography>

        </Toolbar>
      </AppBar>
      	  <ThemeProvider theme={formTheme}>
          <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 650,color:"black" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Guest Id</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Purpose</TableCell>
                <TableCell align="center">Point of Contact</TableCell>
                <TableCell align="center">Contact details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">{row.gid}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.purpose}</TableCell>
                  <TableCell align="center">{row.poc}</TableCell>
                  <TableCell align="center">{row.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </ThemeProvider>
    </Dialog>
  )
}
