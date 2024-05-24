import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CoursePage.css';
import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { coursesElements } from '../MainPage/MainPage';
import { courseInfo } from '../MainPage/MainPage'; 


export let activeStudents = []

function CoursePage() {
    
  const navigate = useNavigate()





  function isCoursOwner() {
    return userInfo.user_id === courseInfo.course_owner
  }
    




  function showCourseMembers(){
    if (isCoursOwner()) {
      return(
        <div className="Course-members-button" onClick={() => navigate('/course-members')}>
          <text className="Course-members-title">Kursanci</text>
        </div>
      )
    }
  }





  function showAddElementButton() {
    if(isCoursOwner()) {
      return (
        <div className="Element-list" onClick={ () => navigate('/create-element') }>
          <text className='Courses-title'>Dodaj nowy element</text>
        </div>
      )
    }
  }


  
  

  return (
    <div>
      


      <TopBar/>



      <div className="App">


        <div className='Container'>

          <div className="Top-container">
            <h3>{courseInfo.course_name}</h3>
            { showCourseMembers() }
          </div>

          { coursesElements }

          { showAddElementButton() }

        </div>


      </div>
      


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
              <div className="Element-list">
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
  getActiveStudents()
}





async function getActiveStudents() {
  const course_id = {course_id_ : courseInfo.course_id}
  await axios.post('http://localhost:3001/api/loadactivestudents', course_id)
  .then(response => {
    const usersTemp = response.data;
    activeStudents.length = 0
    usersTemp.forEach((element) => {
        activeStudents.push(
            <div className="Tile">
                <text className="Name">{element.first_name} {element.last_name}</text>
            </div>
        )
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}