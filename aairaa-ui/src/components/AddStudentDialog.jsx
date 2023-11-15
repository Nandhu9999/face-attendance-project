import React, { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Box, Button, Dialog, IconButton, Slide, Snackbar, Stack, TextField, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import Webcam from 'react-webcam';
import axios from "axios"

import {dataURLtoFile} from "../utils"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import configData from "../config.json"

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

export default function AddStudentDialog({open, onClose}){
  const webcamRef = useRef(null)
  const [imageSrc,setImageSrc] = useState("")
  const [studentname, setStudentName] = useState("")
  const [studentrollno, setStudentRollno] = useState("")
  
  const nameChange = (e)=>{setStudentName(e.target.value)}
  const rollnoChange = (e)=>{setStudentRollno(e.target.value)}

  const [uploadingState, setUploadingState] = useState(false)
  const handleClose = () => {
    setImageSrc("")
    onClose(false)
  }

  const [snackbarMsg, setSnackbarMsg] = useState("")
  function handleCloseSnackbar(){setSnackbarMsg("")}

  const uploadNewStudent = () => {
    setUploadingState(true)

    const filename = studentrollno.toUpperCase() + ".jpg"
    const file = dataURLtoFile(imageSrc,filename);
    const formdata = new FormData();
    formdata.set("name", studentname)
    formdata.set("rollno", studentrollno)
    formdata.set("file", file)

    axios.post(`${configData.SERVER_URL}/api/student/addStudent`, formdata, {
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        console.log(percentCompleted)
        if (percentCompleted === 100){
          setUploadingState(false)
        }
      }
    })
    .then(res => {
      console.log(res.data)
      setUploadingState(false)
      if(res.data.status == "success"){

        if(res.data.output.status == "success"){
          handleClose();
        }else{
          setSnackbarMsg(res.data.output.reason);
        }

      } else {
        setSnackbarMsg("there was an error");
      }
    })
    .catch(function (error) {
      console.log(error);
      setUploadingState(false)
    });
  }

  function takePhoto(){
    setImageSrc( webcamRef.current.getScreenshot() )
  }

  return(
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
            Add New Student
          </Typography>
          <Button autoFocus color="inherit" onClick={uploadNewStudent}>
            Upload
          </Button>
        </Toolbar>
      </AppBar>
      <Stack direction="column" sx={{height:"100%"}}>
        <Box sx={{display:"grid",placeItems:"center",pt:1, overflow:"hidden"}}>
          <Stack direction="row-reverse" gap={1}>
            <Webcam 
              audio={false}
              width={640}
              height={480}
              screenshotFormat="image/jpeg"
              mirrored={true}
              videoConstraints={{width: 640,height: 480,facingMode: "user"}}
              ref={webcamRef}
              />

            <Box sx={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <Button variant="outlined" onClick={takePhoto}>TAKE PHOTO</Button>
            </Box>

            {imageSrc && <Box component="img" alt='snapshot' src={imageSrc} sx={{border:"5px solid var(--theme)",borderRadius:"15px"}}/>}
          </Stack>
        </Box>
        <ThemeProvider theme={formTheme}>
        <Stack component="form" noValidate autoComplete="off" sx={{pl:8}} direction="column" gap={2}>
          <Typography variant="h5" sx={{color:"var(--theme)"}}>Enter Student Details:</Typography>
          <Box><TextField id="outlined-basic" label="Student Name" variant="outlined" sx={{color:"black",minWidth:"300px"}} value={studentname} onChange={nameChange}/></Box>
          <Box><TextField id="outlined-basic" label="Student Rollno" variant="outlined" sx={{color:"black",minWidth:"300px"}} value={studentrollno} onChange={rollnoChange}/></Box>
        </Stack>
        </ThemeProvider>
      </Stack>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={uploadingState}
      >
        <CircularProgress color="inherit" />
      </Backdrop>


      <Snackbar
        anchorOrigin={{ vertical:"top",horizontal:"left" }}
        open={snackbarMsg ? true : false}
        onClose={handleCloseSnackbar}
        autoHideDuration={5000}
        message={snackbarMsg}
        key={"topleft"}
      />

    </Dialog>
  )
}
