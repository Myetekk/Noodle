import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './TopBar.css';
import logo from '../../logo.svg';
import { userInfo } from '../../Pages/Logging/LogIn';





function TopBar() {

  const navigate = useNavigate()





  function showAddCourseButton() {
    if(userInfo.type === 2) {
      return (
        <text className='Top-bar-text' onClick={ () => navigate("/createcourse") }>Utwórz kurs</text>
      )
    }
  }




  
  return (

    <div>

      <div className='Top-bar'>



        <img src={logo} className="Top-bar-app-logo" alt="logo" onClick={ () => navigate("/home") }/>



        <div className='Top-bar-segment'>
          
          { showAddCourseButton() }

          <text className='Top-bar-text' onClick={ () => navigate("/settings") }>{userInfo.first_name} {userInfo.last_name}</text>

        </div>



      </div>

    </div>

  )
}

export default TopBar
