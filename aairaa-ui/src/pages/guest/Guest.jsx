import React, { useRef, useState } from 'react'
import banner from '../../assets/aairaa_banner0.png'
import logo from "../../assets/logo1.png";
import "./Guest.scss";
import axios from "axios"
import configData from "../../config.json";
import { Button, Snackbar } from '@mui/material';
import Webcam from "react-webcam";
import {dataURLtoFile} from "../../utils"

export default function Guest() {

  const [snackbarMsg, setSnackbarMsg] = useState("")
  const [imgSrc, setImgSrc] = useState("")
  function handleCloseSnackbar(){setSnackbarMsg("")}

  const nameRef = useRef(null);
  const purposeRef = useRef(null);
  const pocRef = useRef(null);
  const contactRef = useRef(null);
  const webcamRef = useRef(null);


  const guestSubmit = () => {
  	console.log(nameRef.current.value,purposeRef.current.value,pocRef.current.value,contactRef.current.value)
  	if(!nameRef.current.value || !purposeRef.current.value || !pocRef.current.value || !contactRef.current.value ){
  		setSnackbarMsg("Please fill all the details!")
  		return
  	}
  
   	if(!imgSrc ){
  		setSnackbarMsg("Please capture your face!")
  		return
  	}
  
  
    const filename = nameRef.current.value.toUpperCase() +".jpg"
    const file = dataURLtoFile(imgSrc,filename);
    const formdata = new FormData();

    formdata.set("file", file);
    formdata.set("name", nameRef.current.value);
    formdata.set("purpose", purposeRef.current.value);
    formdata.set("poc", pocRef.current.value);
    formdata.set("contact", contactRef.current.value);

    axios.post(`${configData.SERVER_URL}/api/user/guestSubmit`, formdata)
    .then((response) => {
      console.log(response.data)
      if(response.data.status === "success"){
        setSnackbarMsg("Successfully submitted!")

        nameRef.current.value = ""
        purposeRef.current.value = ""
        pocRef.current.value = ""
        contactRef.current.value = ""
        setImgSrc("")

      }
      else{
	      setSnackbarMsg(response.data.reason)
      }

    })
    .catch((err)=>{
      setSnackbarMsg("There was an error!")
    })
  }

  const captureBtn = () => {
    console.log("hey")
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }

  return (
    <div className="guestPage">
      <div id="container" style={{borderRadius:"15px"}}>
        <div className='left'>

        <div className="header">
          <img src={logo} alt="Logo" className='icon'/>
          &nbsp;
          AAIRAA
        </div>

        <div className="form">
          <div className="form-header">Guest?</div>
          <div className="header-subtitle">Please enter your information</div>
          <div className="form-group">
            <label htmlFor="name" className='form-label'>Your Name</label>
            <input type="text" id="name" className='form-input' ref={nameRef}/>
            <label htmlFor="purpose" className='form-label'>Your Purpose of visit</label>
            <input type="text" id="purpose" className='form-input' ref={purposeRef}/>
            <label htmlFor="poc" className='form-label'>Who is your point of contact</label>
            <input type="text" id="poc" className='form-input' ref={pocRef}/>
            <label htmlFor="contact" className='form-label'>Contact</label>
            <input type="text" id="contact" className='form-input' ref={contactRef}/>
          </div>
          <div className="linkbtn">
            <div className=''>
                <a href="/">Go back to login page</a>
            </div>
          </div>
          <button className="submitBtn" onClick={guestSubmit}>Submit</button>
        </div>

        </div>
        <div className='right' style={{background:"var(--theme)", display:"grid",justifyItems:"center",borderTopRightRadius:"15px", borderBottomRightRadius:"15px"}}>
          <div style={{display:"grid", placeItems:"center", position:"relative"}}>
            <Webcam
              // deviceId={deviceId} 
              audio={false}
              width={"90%"}
              // height={480}
              screenshotFormat="image/jpeg"
              mirrored={true}
              videoConstraints={{width: 640,height: 480,facingMode: "user"}}
              ref={webcamRef}
              style={{borderRadius:"15px",aspectRatio:"16/9"}}
            />
            {imgSrc && <img src={imgSrc} style={{position:"absolute", top:"50%", left:"50%", translate:"-50% -50%", width:"90%", objectFit:"contain", aspectRatio:"16 / 9"}} />}
          </div>
          <button className="captureBtn" onClick={captureBtn}>
            {!imgSrc && "Capture"}
            {imgSrc && "Recapture"}
          </button>

        </div>
      </div>
      
      <div className="copy-right">AAIRAA © 2021 </div>

      <Snackbar
        anchorOrigin={{ vertical:"top",horizontal:"left" }}
        open={snackbarMsg ? true : false}
        onClose={handleCloseSnackbar}
        autoHideDuration={5000}
        message={snackbarMsg}
        key={"topleft"}
      />

    </div>
  )
}
