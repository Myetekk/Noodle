import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CoursePage.css';
import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { coursesElements } from '../MainPage/MainPage';





function CoursePage() {
    
  const navigate = useNavigate()
    




  function showAddElementButton() {
    if(userInfo.type === 2) {
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
}