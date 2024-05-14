import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './MainPage.css';
import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo, userCourses } from '../Logging/LogIn';





export let courseInfo = {course_id: 0, course_name: "", course_owner: ""} 





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











