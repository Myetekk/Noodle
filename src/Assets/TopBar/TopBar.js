import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './TopBar.css';
import logo from '../../logo.svg';
import { userInfo } from '../../Pages/Logging/LogIn';





function TopBar() {

  const navigate = useNavigate()




  
  return (

    <div>

      <div className='Top-bar'>



        <img src={logo} className="Top-bar-app-logo" alt="logo" onClick={ () => navigate("/home") }/>



        <div className='Top-bar-segment'>
          

          <text className='Top-bar-text' onClick={ () => navigate("/settings") }>{userInfo.data.first_name + " " + userInfo.data.last_name}</text>

        </div>



      </div>

    </div>

  )
}

export default TopBar
