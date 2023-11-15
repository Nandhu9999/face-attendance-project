import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import AdminMain from '../../components/Main/AdminMain'
import { Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
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
            <AdminMain flex={10}/>
            <Footer flex={1}/>
        </Stack>
    )
}
export default Admin