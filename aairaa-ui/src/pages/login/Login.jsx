import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import axios from "axios";
import Logo from "../../assets/logo1.png";
import LoginBg from '../../assets/aairaa_banner0.png'
import configData from "../../config.json";
import { Snackbar } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [snackbarMsg, setSnackbarMsg] = useState("")
    function handleCloseSnackbar(){setSnackbarMsg("")}

    const handleLogin = () => {
        // console.log(configData.SERVER_URL)
        // axios.get(`${configData.SERVER_URL}/api/hello`)
        // .then((response)=>{
        //     console.log(response.data)
        // })
        axios.post(`${configData.SERVER_URL}/api/user/login`, {username: username, password: password})
            .then((response) => {
                console.log("response data",response.data)
                if(response.data.message==="Login Successfull"){
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    navigate("/admin");
                }else{
                    alert('Invalid Credentials');
                }
            }
            ).catch((err)=>{
                console.log("there was an error")
                setSnackbarMsg("Invalid Credentials")
            })

    }

return (
<div className="loginpage">
        <div className="loginContainer">
            <div className="left">
                <div className="header">
                    <img src={Logo} alt="Logo"  className='icon'/>
                    &nbsp;
                    AAIRAA
                </div>
                <div className="form">
                    <div className="form-header">Welcome Back</div>
                    <div className="header-subtitle">Please enter your credentials to login</div>
                    <div className="form-group">
                        <label htmlFor="username" className='form-label'>Username</label>
                        <input type="text" id="text" className='form-input' onChange={(e)=>{setUsername(e.target.value)}}/>
                        <label htmlFor="password" className='form-label'>Password</label>
                        <input type="password" id="password" className='form-input' onChange={(e)=>{setPassword(e.target.value)}}/>
                    </div>
                    <div className="remember-forgot">
                        <div className='remember'>
                            <a href="/guest">Are you a Guest? Click Here!</a>
                        </div>
                    </div>
                    <button className="login" onClick={handleLogin}>Sign In</button>
                </div>
                <div className="copy-right">
                        AAIRAA © 2021 
                </div>
            </div>
            <div className="right">
                <img src={LoginBg} alt='login-bg'  className='bg'/>
            </div>
        </div>

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

export default Login