import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './TopBar.css';
import logo from '../../logo.svg';
import { userInfo } from '../Logging/LogIn';





function TopBar() {

  const navigate = useNavigate()

  const navigateToHome = () => {
    navigate("/home")
  }
  
  return (
    <div>
      <div className='Top-bar'>
          <img src={logo} className="Top-bar-app-logo" alt="logo" onClick={() => navigateToHome()}/>
          <text className='Top-bar-text'>{userInfo.user_first_name} {userInfo.user_last_name}</text>
      </div>
    </div>
  )
}

export default TopBar
