import React, { useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'

const LoginPage = ({isLoggedIn, setLoggedIn}) => {

  const navigate = useNavigate()

 

  useEffect(()=>{
    if(isLoggedIn){
      navigate('/')
    }
  })

  return (

    <LoginForm  setLoggedIn={setLoggedIn} />
  )
}

export default LoginPage