import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import '../TopBar/TopBar';
import './MainPage.css';
import TopBar from '../TopBar/TopBar';
import { userCourses } from '../Logging/LogIn';





export let courseInfo = {course_id: 0, course_name: "", course_owner: "", course_users: "", course_elements: ""} 





function MainPage() {
    
    const navigate = useNavigate()
    



    





    return (
        <div>
            


            <TopBar/>



            <header className="Main-page-app">

                <div className='Courses-container'>
                    
                    {userCourses}

                </div>

            </header>



        </div>

    );
}


export default MainPage;