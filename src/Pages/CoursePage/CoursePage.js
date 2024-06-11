import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CoursePage.css';
import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { currentCourseInfo } from '../MainPage/MainPage';





export let activeStudents = []
let numberOfStudents = "x"
// let numberOfUsersSolutions = 0
// let status = ""
// let status_numberOfStudents = ""





function CoursePage() {

  useEffect( () => {
    userInfo.setData(JSON.parse(window.localStorage.getItem('userInfo')))  // sczytanie userInfo z danych zapisanych w przeglądarce 
    setUserId(userInfo.data.user_id)

    currentCourseInfo.setSelectedData(JSON.parse(window.localStorage.getItem('coursesInfo')))  // sczytanie userCourses z danych zapisanych w przeglądarce 
    setCourseName(currentCourseInfo.courseInfo.course_name)
    setCourseOwner(currentCourseInfo.courseInfo.course_owner)

    currentCourseInfo.setVisualData([])  // czyści żeby nie wypisywać kilka razy tego samego (szczególnie przy chodzeniu 'poprzednia strona' 'następna strona')
    currentCourseInfo.setData(JSON.parse(window.localStorage.getItem('coursesElements')))  // sczytanie userCourses z danych zapisanych w przeglądarce 
    visualizeElements(navigate, setCoursesElementsVisualized)  // przekuwa userCourses w widok przycisków kursów
  }, [])




    
  const navigate = useNavigate()

  const [userId, setUserId] = useState(0)

  const [courseName, setCourseName] = useState("")
  const [courseOwner, setCourseOwner] = useState(0)
  const [coursesElementsVisualized, setCoursesElementsVisualized] = useState([])
  // const [elementStatus, setElementStatus] = useState("")





  // sprawdza czy użytkownik jest właścicielem danego kursu
  function isCourseOwner() {
    return userId === courseOwner
  }
    




  // pokazuje przycisk użytkowników w kursie
  function showCourseMembers(){
    if (isCourseOwner()) {
      return(
        <div className="Course-members-button" onClick={() => navigate('/course-members')}>
          <text className="Course-members-title">Kursanci</text>
        </div>
      )
    }
  }





  // pokazuje przycisk dodania nowego elementu
  function showAddElementButton() {
    if(isCourseOwner()) {
      return (
        <div className="Element-list" onClick={ () => navigate('/create-element') }>
          <text className='Courses-title'>Dodaj nowy element</text>
        </div>
      )
    }
  }





  // przekuwa coursesElements w widok przycisków elementów
  async function visualizeElements(navigate, setCoursesElementsVisualized) {
    await checkNumberOfUsersInCourse(numberOfStudents)

    currentCourseInfo.coursesElements.forEach( (element) => {

      currentCourseInfo.visualCoursesElements.push(
        <div className="Element-list">
          <text className='Courses-title'>{element.name}</text>
          <text className='Courses-description'>opis: {element.description}</text>
          <text className='Courses-description'>otwarcie: {element.open_date}</text>
          <text className='Courses-description'>zamknięcie: {element.close_date}</text>
          <text className='Courses-description'>status: { loadElementStatus(element) }</text>  {/* jeśli to właściciel kursu: ilość przesłanych zadań (np. 10/16); jeśli zwykły użytkownik: czy przesłano rozwiązanie, czy oceniono, jak ocena */}
        </div>
      )
    })

    setCoursesElementsVisualized(currentCourseInfo.visualCoursesElements)
    getActiveStudents()
  }





  function loadElementStatus(element) {
    if (userInfo.data.user_id === currentCourseInfo.courseInfo.course_owner) {  // gdy użytkownik jest właścicielem kursu
      return (
        <text>{element.number_solutions_in_element}/{numberOfStudents}</text>
      )
    }
    else {  // gdy użytkownik nie jest właścicielem kursu
      if ( element.solutions_sent === 0) {
        return (
          <text>nie przesłano</text>
        )
      }
      else {
        return (
          <text>przesłano</text>
        )
      }

    }
  }





  //pobiera info o ilości użytkowników w kursie
  async function checkNumberOfUsersInCourse() {
    const course_id = {course_id_ : currentCourseInfo.courseInfo.course_id, user_id_: userInfo.data.user_id}

    await axios.post('http://localhost:3001/api/usersincourse', course_id)
    .then(response => {
      const numberOfUsers = response.data;
      numberOfStudents = numberOfUsers[0].number_users_in_course
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }





  // pobiera info o użytkownikach w danym kursie
  async function getActiveStudents() {
    const course_id = {course_id_ : currentCourseInfo.courseInfo.course_id, user_id_: userInfo.data.user_id}

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


  
  

  return (
    <div>
      


      <TopBar/>



      <div className="App">


        <div className='Container'>

          <div className="Top-container">
            <h3>{courseName}</h3>
            { showCourseMembers() }
          </div>

          { coursesElementsVisualized }

          { showAddElementButton() }

        </div>


      </div>
      


    </div>
  )
}

export default CoursePage










