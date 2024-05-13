import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './MainPage.css';
import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
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
export async function getUsersCourses(navigate)  {
    const user_id = { user_id_: userInfo.user_id }
    const userCourseId = [];
    let userCourseIdTemp;

    await axios.post('http://localhost:3001/api/usercourses', user_id)
    .then( response => {
        userCourseIdTemp = response.data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    userCourseIdTemp.forEach( (element) => {
        userCourseId.push( element.course_id_connection )
    });

    await getUsersCoursesInfo(navigate, userCourseId)
}



async function getUsersCoursesInfo(navigate, userCourseId) {

    console.log(userCourseId)
    await axios.post('http://localhost:3001/api/loadcourses', userCourseId)
    .then( response => {
        const userCoursesTemp = response.data;
        
        userCoursesTemp.forEach( (element) => {
            userCourses.push(
                <div className="Courses" onClick={() => navigateToCourse(navigate, element.course_id, element.course_name, element.course_owner)}>
                    <text className='Courses-title'>{element.course_name}</text>
                    <text className='Courses-description'>prowadzący kursu: {element.course_owner}</text>
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
