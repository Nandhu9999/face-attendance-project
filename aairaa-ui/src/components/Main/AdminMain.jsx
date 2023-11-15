import { Box,Grid, Tab, Tabs, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'

import Attendance from "./Attendance"
import Emotion from "./Emotion"
import Activity from "./Activity"
import HandGesture from "./HandGesture"
import BodyPose from "./BodyPose"
import CameraComponent from "../CameraComponent"

import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import Face6RoundedIcon from '@mui/icons-material/Face6Rounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import BackHandRoundedIcon from '@mui/icons-material/BackHandRounded';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';

const tabStyles = {
  p:{xs:0,sm:2},
  minWidth:{xs:"80px !important",sm:"100px"},
}
const tabTxtStyles = {
  fontSize:".8rem",
  display:{xs:"none", sm:"block"}
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{height:"100%", width:"100%"}}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AdminMain() {
  const [tabMode, setTabMode] = useState(0)
  const handleTabChange = (evt,newVal) => {setTabMode(newVal)}

  const webcamRef = useRef(null)

  return (
    <Grid container direction={{xs: "column", sm: "row"}} style={{height:"100%", overflow:"hidden"}}>

      <CameraComponent webcamRef={webcamRef} flipOption={false}/>

      {/* CONTROLS BOX */}
      <Box flex={{xs: 1, sm: 4}} style={{height:"100%", width:"100%"}}>
        <Tabs value={tabMode} onChange={handleTabChange} aria-label="tab" variant="scrollable" scrollButtons="auto">
          <Tab sx={tabStyles} label={<><AssignmentIndRoundedIcon /><Typography sx={tabTxtStyles}>Attendance</Typography></>} {...a11yProps(0)} />
          <Tab sx={tabStyles} label={<><Face6RoundedIcon /><Typography sx={tabTxtStyles}>Emotion</Typography></>} {...a11yProps(1)} />
          <Tab sx={tabStyles} label={<><DirectionsRunRoundedIcon /><Typography sx={tabTxtStyles}>Activity</Typography></>} {...a11yProps(2)} />
          <Tab sx={tabStyles} label={<><BackHandRoundedIcon /><Typography sx={tabTxtStyles}>Hand Gesture</Typography></>} {...a11yProps(3)} />
          <Tab sx={tabStyles} label={<><AccessibilityNewRoundedIcon /><Typography sx={tabTxtStyles}>Body Pose</Typography></>} {...a11yProps(4)} />
        </Tabs>

        {/* LIST OF TABS */}
        <CustomTabPanel value={tabMode} index={0}>
          <Attendance cam={webcamRef}/>
        </CustomTabPanel>
        <CustomTabPanel value={tabMode} index={1}>
          <Emotion webcamRef={webcamRef}/>
        </CustomTabPanel>
        <CustomTabPanel value={tabMode} index={2}>
          <Activity/>
        </CustomTabPanel>
        <CustomTabPanel value={tabMode} index={3}>
          <HandGesture/>
        </CustomTabPanel>
        <CustomTabPanel value={tabMode} index={4}>
          <BodyPose/>
        </CustomTabPanel>
      </Box>

    </Grid>
  )
}
