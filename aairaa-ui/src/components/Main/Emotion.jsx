import LoadingButton from '@mui/lab/LoadingButton/LoadingButton'
import { Avatar, Box, Divider, FormControlLabel, List, ListItem, ListItemAvatar, ListItemText, Snackbar, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import * as faceapi from 'face-api.js';

const emotionIcons = [
  <span className="material-symbols-outlined">sentiment_neutral</span>,
  <span className="material-symbols-outlined">sentiment_satisfied</span>,
  <span className="material-symbols-outlined">sentiment_dissatisfied</span>,
  <span className="material-symbols-outlined">sentiment_extremely_dissatisfied</span>,
  <span className="material-symbols-outlined">mood_bad</span>,
  <span className="material-symbols-outlined">sick</span>,
  <span className="material-symbols-outlined">mood</span>
]
const emotionTypes = ["neutral","happy","sad","angry","fearful","disgusted","surprised"]

async function loadModels(){
  const MODEL_URL = '/model/weights/'

  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
}

export default function Emotion({webcamRef}) {
  const [detect, setDetect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disableBtn, setDisableBtn] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [emotionWeights, setEmotionWeights] = useState([0,0,0,0,0,0,0])

  function switchTriggered(evt){setDetect(evt.target.checked)}
  useEffect(() => {
    let intervalId;
    if (detect) {intervalId = setInterval(() => {checkEmotion();}, 500);}
    return () => {clearInterval(intervalId);};
  }, [detect]);

  function loadModel(){
    setModelLoaded(true)
    setLoading(true)
    setDisableBtn(true)
  }

  useEffect(()=>{
    async function run(){
      await loadModels()
      setLoading(false)
    }
    if(modelLoaded == true){
      console.log("load model")
      run()
    }
  },[modelLoaded])

  async function checkEmotion(){
    if(detect == false){console.log();}
    if(webcamRef.current == null){setSnackbarMsg("Camera is required");setDetect(false);return}
    if(modelLoaded == false){setSnackbarMsg("Model isn't loaded");setDetect(false);return}

    const img = new Image
    img.src = webcamRef.current.getScreenshot();
    try {
    await img.decode();
    } catch(err){
      setSnackbarMsg("Error occurred while decoding image");
    }
    let faceDescriptions = await faceapi.detectAllFaces( img ).withFaceExpressions()
    if(faceDescriptions.length > 0 ){
      let predictions = [faceDescriptions[0].expressions.neutral,faceDescriptions[0].expressions.happy,faceDescriptions[0].expressions.sad,faceDescriptions[0].expressions.angry,faceDescriptions[0].expressions.fearful,faceDescriptions[0].expressions.disgusted,faceDescriptions[0].expressions.surprised ]
      predictions = predictions.map(val=>{return (Math.round((val + Number.EPSILON) * 10000) / 100)})
      setEmotionWeights(predictions)
    }
  }


  const [snackbarMsg, setSnackbarMsg] = useState("")
  function handleCloseSnackbar(){
    setSnackbarMsg("")
  }


  return (
    <Box>
      <Box sx={{textAlign:"center",p:2}}>
      <LoadingButton
          onClick={loadModel}
          loading={loading}
          loadingIndicator="Loading Model..."
          variant="contained"
          sx={{width:"300px"}}
          disabled={disableBtn}
        >
          <span>{modelLoaded == false ? "Load Model" : "Model Loaded"}</span>
        </LoadingButton>
      </Box>
      <Divider />
      <List dense sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper', marginInline:"auto" }}>
        {emotionTypes.map((item,idx) => (
          <ListItem
            key={item}
            secondaryAction={
              <Typography variant="h5">{emotionWeights[idx]}</Typography>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{bgcolor:"transparent",color:"black"}}>
                {emotionIcons[idx]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={<Typography variant="h6">{item}</Typography>} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{textAlign:"center",pt:5}}>
        <FormControlLabel
            value="start"
            control={<Switch color="primary" checked={detect} onChange={switchTriggered}/>}
            label={<Typography variant="h5">Detect Emotion</Typography>}
            labelPlacement="start"
          />
      </Box>

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
