import { Box, Button, Grid, Snackbar, Stack } from '@mui/material'
import React, { useRef, useState } from 'react'
import CameraComponent from '../CameraComponent'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';

export default function StudentMain() {
  const webcamRef = useRef(null)
  const [loadingCheckStudent, setLoadingCheckStudent] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState("")
  function handleCloseSnackbar(){setSnackbarMsg("")}

  function checkStudent(){
    if(webcamRef.current == null){
      setSnackbarMsg("Camera is required");
      return
    }
    
    setLoadingCheckStudent(true)
    const imgSrc = webcamRef.current.getScreenshot();
    // async function checkAttendance(){}
    console.log(webcamRef)  
    setTimeout(()=>{
      setLoadingCheckStudent(false)
    },1000)
  }
  function editStudent(){}


  return (
    <Grid container direction={{xs: "column", sm: "row"}} style={{height:"100%", overflow:"hidden"}}>
      <CameraComponent webcamRef={webcamRef} flipOption={false}/>
      {/* CONTROLS BOX */}
      <Box flex={{xs: 1, sm: 3}} style={{height:"100%", width:"100%"}}>
        <Stack direction="column" sx={{gap:"20px",p:2,height:"100%"}} justifyContent="center">
          <LoadingButton
            loading={loadingCheckStudent}
            variant="contained" 
            size="large" 
            startIcon={<SensorOccupiedIcon />} 
            sx={{width:"100%"}}
            onClick={checkStudent}
          >
            Check Attendance
          </LoadingButton>
          <Button 
            variant="contained"
            size="large" 
            startIcon={<ManageAccountsIcon />} 
            sx={{width:"100%"}}
            onClick={editStudent}
          >
            Edit My Profile
          </Button>

        </Stack>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical:"top",horizontal:"left" }}
        open={snackbarMsg ? true : false}
        onClose={handleCloseSnackbar}
        autoHideDuration={5000}
        message={snackbarMsg}
        key={"topleft"}
      />

    </Grid>
  )
}
