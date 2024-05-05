import React from 'react'

import TopBar from '../TopBar/TopBar';
import './CoursePage.css';
import { courseInfo } from '../MainPage/MainPage';





function CoursePage() {





//


  
  

  return (
    <div>
      


      <TopBar/>



      <header className="Course-page-app">


        <div className='Courses-container'>
          
          <div className='Course-segment'>
            <text>{courseInfo.course_id}</text>
            <text>{courseInfo.course_name}</text>
            <text>{courseInfo.course_owner}</text>
          </div>

        </div>


      </header>
      


    </div>
  )
}

export default CoursePage
