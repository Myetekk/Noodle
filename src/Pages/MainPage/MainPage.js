import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './MainPage.css';
import '../../App.css';
import TopBar from '../TopBar/TopBar';
import { userInfo, userCourses } from '../Logging/LogIn';





export let courseInfo = {course_id: 0, course_name: "", course_owner: "", course_users: "", course_elements: ""} 





function MainPage() {
    
    const navigate = useNavigate()
    



    





    return (
        <div>
            


            <TopBar/>



            <header className="App">

                <div className='Courses-container'>
                    
                    {userCourses}

                </div>

            </header>



        </div>
    );
}
export default MainPage;










// pobiera informacje o kursach użytkownika
export async function getUsersCoursesFromDatabase(navigate)  {
    const userCourseId = { course_id_: userInfo.courses };

    await axios.post('http://localhost:3001/api/userscourses', userCourseId)
    .then( response => {
        const userCoursesTemp = response.data;
        
        userCoursesTemp.forEach( (element) => {
            userCourses.push(
                <div className="Course" onClick={() => navigateToCourse(navigate, element.course_id, element.course_name, element.course_owner)}>
                    <text className='Course-title'>{element.course_name}</text>
                    <text className='Course-description'>prowadzący kursu: {element.course_owner}</text>
                </div>
            )
        })

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// przekazuje informacje o wybranym (klikniętym) kursie i przekierowywuje do niego
function navigateToCourse(navigate, current_course_id, current_course_name, current_course_owner) {
    courseInfo.course_id = current_course_id
    courseInfo.course_name = current_course_name
    courseInfo.course_owner = current_course_owner
    navigate("/course")
}