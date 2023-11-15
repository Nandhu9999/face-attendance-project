import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import StudentMain from '../../components/Main/StudentMain'
import { Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Student = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token){
            navigate("/")
        }
    })
    return (
        <Stack direction="column" style={{height:"100%", background:"white"}}>
            <Navbar flex={1}/>
            <StudentMain flex={10}/>
            <Footer flex={1}/>
        </Stack>
    )
}
export default Student