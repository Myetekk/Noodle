import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './HeadAdmin.css';
import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo, userCourses } from '../Logging/LogIn';








function HeadAdmin() {
    
    const navigate = useNavigate()
    



    





    return (
        <div>
            


            <TopBar/>



            <div className="App">

                <div className="HeadAdmin">
                    
                    <text > Witaj wujku! To zaszczyt znów cię widzieć. </text>

                </div>

            </div>



        </div>
    );
}
export default HeadAdmin;
