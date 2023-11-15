import React, { useState } from 'react'
import { Box, Stack, IconButton } from '@mui/material'
import Webcam from "react-webcam";

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import CameraRearIcon from '@mui/icons-material/CameraRear';
// import CameraIcon from '@mui/icons-material/Camera';

export default function CameraComponent({webcamRef, flipOption}) {

  const [cameraState, setCameraState] = useState(false)
  const [cameraDirection, setCameraDirection] = useState("user")
  
  // const [deviceId, setDeviceId] = React.useState({});
  // const [devices, setDevices] = React.useState([]);
  // const handleDevices = React.useCallback(mediaDevices =>setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),[setDevices]);
  // useEffect(() => {navigator.mediaDevices.enumerateDevices().then(handleDevices);},[handleDevices]);

  const handleCameraState = () => {
    setCameraState(prev => !prev)
  }
  const handleCameraDirection = () => {
    setCameraDirection(prev => {
      if(prev === "user"){return "enviroment"}
      else{return "user"}
    })
  }
  
  // const capture = () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   console.log(imageSrc)
  // }


  return (
    <Box flex={{xs: 1, sm: 6}} style={{
      height:"100%",
      width:"100%",
      display:"grid",
      placeItems:"center",
      position:"relative",
      background:"black"
    }}>
      
    {cameraState && <Webcam
      // deviceId={deviceId} 
      audio={false}
      width={"98%"}
      height={480}
      screenshotFormat="image/jpeg"
      mirrored={true}
      videoConstraints={{width: 640,height: 480,facingMode: cameraDirection}}
      ref={webcamRef}
      style={{borderRadius:"15px"}}
    />}

    <Stack direction="row" sx={{position:"absolute", bottom:"15px", background:"#323232", p:1, borderRadius:"50px", gap:"10px", border:"5px solid rgba(255,255,255,0.125)"}}>
      <IconButton variant="outlined" onClick={handleCameraState} sx={{color:"white",border:"2px solid rgba(255,255,255,0.125)"}}>
        {cameraState ? <CloseIcon /> : <CameraAltIcon />}
      </IconButton>

      {flipOption && <IconButton variant="outlined" onClick={handleCameraDirection} sx={{color:"white",border:"2px solid rgba(255,255,255,0.125)"}}>
        {cameraDirection === "user" ? <CameraFrontIcon /> : <CameraRearIcon />}
      </IconButton>}

      {/*(devices.length > 1) && devices.map((device, key) => (
          <IconButton
            variant="outlined"
            key={device.deviceId}
            onClick={() => setDeviceId(device.deviceId)}
            sx={{color:"white"}}
          >
          <CameraIcon />
            { 
              <Typography sx={{color:"white",borderBottom:"2px solid rgba(255,255,255,0.125)"}}> {device.label.split(" ")[0]} </Typography> 
            || `Device ${key + 1}`}
          </IconButton>
      ))
      */}
      
    </Stack>

  </Box>
  )
}
