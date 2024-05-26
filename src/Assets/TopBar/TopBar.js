import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import './TopBar.css';
import logo from '../../logo.svg';
import { userInfo } from '../../Pages/Logging/LogIn';





function TopBar() {

  useEffect( () => {
    userInfo.setData(JSON.parse(window.localStorage.getItem('userInfo')))  // sczytanie userInfo z danych zapisanych w przeglądarce 
    setFirstName(userInfo.data.first_name)
    setLastName(userInfo.data.last_name)
  }, [])



  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")





  
  return (

    <div>

      <div className='Top-bar'>



        <img src={logo} className="Top-bar-app-logo" alt="logo" onClick={ () => navigate("/home") }/>



        <div className='Top-bar-segment'>

          <text className='Top-bar-text' onClick={ () => { navigate("/settings") } }>{firstName + " " + lastName}</text>

        </div>



      </div>

    </div>

  )
}

export default TopBar
