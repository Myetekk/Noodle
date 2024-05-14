import React from 'react'
import axios from 'axios';

import './CoursePage.css';
import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { courseInfo, coursesElements } from '../MainPage/MainPage';





function CoursePage() {





  //


  
  

  return (
    <div>
      


      <TopBar/>



      <header className="App">


        <div className='Course-container'>
          
          {/* <div className='Course-segment'>
            <text className='Course-title'>id: {courseInfo.course_id}</text>
            <text>name: {courseInfo.course_name}</text>
            <text>owner: {courseInfo.course_owner}</text>
          </div> */}

          { coursesElements }

        </div>


      </header>
      


    </div>
  )
}

export default CoursePage










export async function getCoursesElementsInfo(navigate, elementId) {
    await axios.post('http://localhost:3001/api/loadelements', elementId)
    .then( response => {
        const coursesElementsTemp = response.data;
        
        coursesElementsTemp.forEach( (element) => {
          coursesElements.push(
                <div className="Courses">
                    <text className='Courses-title'>{element.name}</text>
                    <text className='Courses-description'>opis: {element.description}</text>
                    <text className='Courses-description'>otwarcie: {element.open_date}</text>
                    <text className='Courses-description'>zamknięcie: {element.close_date}</text>
                </div>
            )
        })

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}