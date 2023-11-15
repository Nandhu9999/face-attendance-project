import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, ThemeProvider, createTheme } from '@mui/material';
import axios from "axios"
import configData from "../config.json"

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

export default function ConfirmGuestDialog({open, onClose, prediction}){
	const [purpose, setPurpose] = useState("");

  const handleClose = () => {
    onClose(false)
  }

  const submitPurpose = () => {
	axios.post(`${configData.SERVER_URL}/api/user/newPurpose`, {name: prediction, purpose:purpose }, {
	  onUploadProgress: progressEvent => {
	    const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
	    console.log(percentCompleted)
	  }
	})
	.then(res => {
	  console.log(res.data)
	  handleClose();
	})
	.catch(function (error) {
	  console.log(error);
	});
  }

  return(
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title" sx={{color:"black"}}>
          {`Welcome ${prediction}!`}
        </DialogTitle>
        <ThemeProvider theme={formTheme}>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">Please tell us your purpose of visit?</DialogContentText>
              <Box>
              	<TextField 
              		multiline 
              		rows={4} 
              		id="outlined-basic" 
              		label="Detailed description of your visit" 
              		variant="outlined" 
              		sx={{p:0,mt:2, color:"black",minWidth:"500px"}} 
              		value={purpose} 
              		onChange={(e)=>{setPurpose(e.target.value)}}
              	/>
              </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={submitPurpose} autoFocus>Submit</Button>
          </DialogActions>
        </ThemeProvider>
    </Dialog>
  )
}
