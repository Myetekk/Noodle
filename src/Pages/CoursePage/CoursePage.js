import React from 'react'

import './CoursePage.css';
import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { courseInfo } from '../MainPage/MainPage';





function CoursePage() {





  //


  
  

  return (
    <div>
      


      <TopBar/>



      <header className="App">


        <div className='Course-container'>
          
          <div className='Course-segment'>
            <text className='Course-title'>id: {courseInfo.course_id}</text>
            <text>name: {courseInfo.course_name}</text>
            <text>owner: {courseInfo.course_owner}</text>
          </div>

        </div>


      </header>
      


    </div>
  )
}

export default CoursePage
