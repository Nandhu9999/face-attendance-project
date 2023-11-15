import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, ThemeProvider, createTheme } from '@mui/material';
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

export default function ConfirmStudentDialog({open, onClose, prediction, goto_url}){
  const [initalState, setInitalState] = useState(true)
  const [correctedRollno, setCorrectedRollno] = useState("")
  const handleClose = () => {
    onClose(false)
  }

  const goNextState = () => {setInitalState(false)}
  const goBackState = () => {setInitalState(true)}

  const handleCorrectedRollno = (e) => {
    setCorrectedRollno(e.target.value)
  }
  const submitCorrected = () => {
    console.log(prediction, correctedRollno)
    onClose(false)
    setCorrectedRollno("")
    goBackState()

    axios.post(`${configData.SERVER_URL}/api/student/${goto_url}`, {incorrect_rollno: prediction, correct_rollno:correctedRollno}, {
      onUploadProgress: progressEvent => {const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );console.log(percentCompleted)}
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(function (error) {console.log(error);});

  }
  const submitOriginal = () => {
    console.log(prediction, correctedRollno)
    onClose(false)
    setCorrectedRollno("")
    goBackState()

    axios.post(`${configData.SERVER_URL}/api/student/${goto_url}`, {incorrect_rollno: prediction, correct_rollno:prediction}, {
      onUploadProgress: progressEvent => {const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );}
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(function (error) {console.log(error);});

  }

  return(
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title" sx={{color:"black"}}>
          {`Are you ${prediction}?`}
        </DialogTitle>
        <ThemeProvider theme={formTheme}>
        { initalState &&
          <>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If the model has predicted you incorrectly, then
              please select NO to this so it can be notified and logged
              in our database for further corrections.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={goNextState}>No, It's Wrong</Button>
            <Button onClick={submitOriginal} autoFocus>Yes</Button>
          </DialogActions>
          </>
        }
        { !initalState &&
          <>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">Please Enter Your Correct Rollno!</DialogContentText>
              <Box>
              <TextField id="outlined-basic" label="Your Rollno" variant="outlined" sx={{p:0,mt:2, color:"black",minWidth:"300px"}} value={correctedRollno} onChange={handleCorrectedRollno}/>  
              </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={goBackState}>Back</Button>
            <Button onClick={submitCorrected} autoFocus>Submit</Button>
          </DialogActions>
          </>
        }
        </ThemeProvider>

    </Dialog>
  )
}
