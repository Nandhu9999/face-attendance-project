import { Avatar, Box, Button, 
  Dialog, DialogTitle, Divider, 
  IconButton, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Snackbar, Stack, 
  ThemeProvider, Typography, createTheme
} from '@mui/material'
import React, { useEffect, useState } from 'react'

import FaceIcon from '@mui/icons-material/Face';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import AddStudentDialog from '../AddStudentDialog';
// import AddGuestDialog from '../AddGuestDialog';
import ConfirmGuestDialog from '../ConfirmGuestDialog';

import axios from "axios"
import configData from "../../config.json"
import {getToday, dataURLtoFile, json2csv_download} from "../../utils"
import ConfirmStudentDialog from '../ConfirmStudentDialog';

const dialogTheme = createTheme({
  text:{
    main:"#000000"
  }
})

const listTheme = createTheme({
  secondary:{
    main: "#BE1D60"
  }
})


function SimpleDialog( { onClose, selectedUser, open } ) {
  let timestamp1,timestamp2;
  const newdate1 = (new Date(selectedUser.last_attended)).toString()
  const newdate2 = (new Date(selectedUser.last_exited)).toString()
  if(newdate1.indexOf("GMT")){timestamp1 = newdate1.split("GMT")[0]}
  if(newdate2.indexOf("GMT")){timestamp2 = newdate2.split("GMT")[0]}
  const handleClose = () => {onClose();};
  const handleListItemClick = (value) => {onClose(value);};
  return (
    <ThemeProvider theme={dialogTheme}>
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>User Details</DialogTitle>
      <Divider />
      <Box sx={{p:2}}>
        <Typography variant="p">Name:</Typography>
        <Typography variant="h6">{selectedUser.name}</Typography>
        <Typography variant="p">RollNo:</Typography>
        <Typography variant="h6">{selectedUser.rollno}</Typography>
        <Typography variant="p">Last Attended:</Typography>
        <Typography variant="h6">{timestamp1 ? timestamp1 : "NA"}</Typography>
        <Typography variant="p">Last Exited:</Typography>
        <Typography variant="h6">{timestamp2 ? timestamp2 : "NA"}</Typography>
      </Box>
    </Dialog>
    </ThemeProvider>
  );
}

export default function Attendance({cameraState, cam}) {
  const [AttendanceList, setAttendanceList] = useState([])

  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [confirmStudentDialogOpen, setConfirmStudentDialogOpen] = useState(false)
  const [selectedUserDetails, setSelectedUserDetails] = useState({})

  const [predictedStudent, setPredictedStudent] = useState("")
  function showUserDialog(u){
    setSelectedUserDetails(u)
    setUserDialogOpen(true)
  }
  function handleUserDialogClose(){setUserDialogOpen(false)}
  function handleAddStudentDialogClose(){setStudentDialogOpen(false)}
  function handleConfirmStudentDialogClose(){setConfirmStudentDialogOpen(false)}
  function handleAddGuestDialogClose(){setGuestDialogOpen(false)}

  const [loadingCheckStudentEnter, setLoadingCheckStudentEnter] = useState(false)
  const [loadingCheckStudentExit, setLoadingCheckStudentExit] = useState(false)

  useEffect(()=>{
    axios.get(`${configData.SERVER_URL}/api/student/attendanceList`)
    .then(res=>{
      // console.log(res)
      if(res.data.status === "success"){
        setAttendanceList(res.data.list)
      }
      // console.log(AttendanceList)
    })
    .catch(err=>{
      console.log(err)
    })

  },[studentDialogOpen,confirmStudentDialogOpen])

  const [snackbarMsg, setSnackbarMsg] = useState("")
  function handleCloseSnackbar(){setSnackbarMsg("")}
  function checkStudentEnter(){
    setPredictedStudent("")
    if(cam.current === null){
      setSnackbarMsg("Camera is required")
      return
    }
    setLoadingCheckStudentEnter(true)
    const photo = cam.current.getScreenshot();
    const filename = Date.now()+".jpg"
    const file = dataURLtoFile(photo,filename);
    const formdata = new FormData();

    // formdata.set("file", file);
    formdata.set("file", file);
    
    axios.post(`${configData.SERVER_URL}/api/student/checkStudent`, formdata, {
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        console.log(percentCompleted)
      }
    })
    .then(res => {
      console.log(res.data)
      if(res.data.status == "success"){
      	if (res.data.output.found == true){
		  setLoadingCheckStudentEnter(false)
		  setConfirmStudentDialogOpen(true)
		  setPredictedStudent(res.data.output.identity)
      	} else {
      		setSnackbarMsg("Student was not found in the database");
      		setLoadingCheckStudentEnter(false)
      	}
      }
    })
    .catch(function (error) {
      console.log(error);
      setLoadingCheckStudentEnter(false)
      setSnackbarMsg("There was an error")
    });

  }

  function checkStudentExit(){
    setPredictedStudent("")

    if(cam.current === null){
      setSnackbarMsg("Camera is required")
      return
    }
    setLoadingCheckStudentExit(true)
    const photo = cam.current.getScreenshot();

    if(photo === null){
      setLoadingCheckStudentExit(false)
      setSnackbarMsg("Camera is not working")
      return
    }

    const filename = Date.now()+".jpg"
    const file = dataURLtoFile(photo,filename);
    const formdata = new FormData();

    // formdata.set("file", file);
    formdata.set("file", file);
    
    axios.post(`${configData.SERVER_URL}/api/student/checkStudent`, formdata, {
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        console.log(percentCompleted)
      }
    })
    .then(res => {
      console.log(res.data)
      if(res.data.status == "success"){
      	if (res.data.output.found == true){
          setLoadingCheckStudentExit(false)
          setConfirmStudentDialogOpen(true)
		      setPredictedStudent(res.data.output.identity)
      	} else {
      		setSnackbarMsg("Student was not found in the database");
      		setLoadingCheckStudentExit(false)
      	}
      }
    })
    .catch(function (error) {
      console.log(error);
      setLoadingCheckStudentExit(false)
      setSnackbarMsg("There was an error")
    });

  }

  function addStudent(){setStudentDialogOpen(true)}
  
  const [predictedGuest, setPredictedGuest] = useState("")
  const [guestDialogOpen, setGuestDialogOpen] = useState(false)
  const [loadingCheckGuest, setLoadingCheckGuest] = useState(false)	
  
  function handleCheckGuestDialogClose(){setGuestDialogOpen(false)}
  
  function checkGuest(){
	if(cam.current === null){
      setSnackbarMsg("Camera is required")
      return
    }
    setLoadingCheckGuest(true)
    const photo = cam.current.getScreenshot();
    const filename = Date.now()+".jpg"
    const file = dataURLtoFile(photo,filename);
    const formdata = new FormData();

    // formdata.set("file", file);
    formdata.set("file", file);
    
    axios.post(`${configData.SERVER_URL}/api/user/checkGuest`, formdata, {
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        console.log(percentCompleted)
      }
    })
    .then(res => {
      console.log(res.data)
      if(res.data.status == "success"){
      	if (res.data.output.found == true){
		  setLoadingCheckGuest(false)
		  setPredictedGuest(res.data.output.identity)
		  setGuestDialogOpen(true)
      	} else {
      		setSnackbarMsg("Guest was not found in the database");
      		setLoadingCheckGuest(false)
      	}
      }
    })
    .catch(function (error) {
      console.log(error);
      setLoadingCheckGuest(false)
      setSnackbarMsg("There was an error")
    });	
  }


  return (
    <Box sx={{width:"100%"}}>
      <List dense={true} sx={{
        background:"linear-gradient(rgba(190,29,96,0.5),rgba(190,29,96,0.1),transparent,rgba(190,29,96,0.1),rgba(190,29,96,0.5))", 
        width:{xs:"100%", sm:"100%"}, 
        height:{xs:"150px", sm:"300px"}, 
        borderRadius:"10px",
        overflowY:"auto"}}
        subheader={<li />}
      > 
        <ListSubheader sx={{lineHeight:"24px",width:"calc(100% - 70px)",mt:"3px",ml:"10px",borderRadius:"10px",bgcolor:"var(--theme2)",color:"white",display:"flex",lineHeight:"2",justifyContent:"space-between"}}>
          <Box>{getToday()}</Box>
          <Button onClick={()=>{json2csv_download(AttendanceList)}}
            sx={{fontSize:"0.6rem"}}>DOWNLOAD</Button>
        </ListSubheader>
        { AttendanceList.length === 0 && <Box sx={{p:2,pt:4, textAlign:"center"}}>No Students Available</Box> }
        { AttendanceList.map(user=>{
            return (<ListItem 
              key={user.rollno}
              sx={{
                ml:"10px",mt:"5px",
                borderRadius:"15px",
                width:"calc(100% - 20px)", 
                bgcolor: listTheme.secondary.main
              }}
              secondaryAction={ 
                <IconButton
                  onClick={(e)=>{showUserDialog(user)}}
                  edge="end" 
                  aria-label="delete">
                  { (Date.now() - user.last_attended < (1000 * 60 * 60)) 
                      ? <CheckCircleOutlineIcon /> 
                      : <HelpOutlineRoundedIcon />
                  }
                </IconButton> 
              }>
              <ListItemAvatar>
                <Avatar>
                  <FaceIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.rollno}/>
            </ListItem>)
          })
        }
        {/* USER DETAILS DIALOG BOX */}
        <SimpleDialog
          selectedUser={selectedUserDetails}
          open={userDialogOpen}
          onClose={handleUserDialogClose}
        />
      </List>
      <br/>
      <Divider />

      <Stack direction="column" sx={{gap:"20px",pt:2}}>

        <LoadingButton 
          loading={loadingCheckStudentEnter}
          variant="contained" 
          size="large" 
          startIcon={<LoginIcon />} 
          sx={{width:"100%"}}
          onClick={checkStudentEnter}
        >
          Check Student Enter
        </LoadingButton>

        <ConfirmStudentDialog
          open={confirmStudentDialogOpen}
          onClose={handleConfirmStudentDialogClose}
          prediction={predictedStudent}
          goto_url={"checkStudentConfirmed"}
        />

        <LoadingButton 
          loading={loadingCheckStudentExit}
          variant="contained" 
          size="large" 
          startIcon={<LogoutIcon />} 
          sx={{width:"100%"}}
          onClick={checkStudentExit}
        >
          Check Student Exit
        </LoadingButton>

        <ConfirmStudentDialog
          open={confirmStudentDialogOpen}
          onClose={handleConfirmStudentDialogClose}
          prediction={predictedStudent}
          goto_url={"checkStudentExit"}
        />

        <Button 
          variant="contained"
          size="large" 
          startIcon={<PersonAddIcon />} 
          sx={{width:"100%"}}
          onClick={addStudent}
        >
          Add Student
        </Button>

        <AddStudentDialog
          open={studentDialogOpen}
          onClose={handleAddStudentDialogClose}
        />


        <LoadingButton
          loading={loadingCheckGuest} 
          variant="contained" 
          size="large" 
          startIcon={<RecordVoiceOverIcon />} 
          sx={{width:"100%"}}
          onClick={checkGuest}
        >
          Check Guest
        </LoadingButton>

        <ConfirmGuestDialog
          open={guestDialogOpen}
          onClose={handleAddGuestDialogClose}
          prediction={predictedGuest}
        />

      </Stack>
    
      <Snackbar
        anchorOrigin={{ vertical:"top",horizontal:"left" }}
        open={snackbarMsg ? true : false}
        onClose={handleCloseSnackbar}
        autoHideDuration={5000}
        message={snackbarMsg}
        key={"topleft"}
      />

    </Box>
  )
}
