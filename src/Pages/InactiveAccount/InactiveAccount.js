import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './InactiveAccount.css';
import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo, userCourses } from '../Logging/LogIn';








function InactiveAccount() {
    
    const navigate = useNavigate()
    



    





    return (
        <div>
            


            <TopBar/>



            <header className="App">

                <div className="Inactive-account">
                    
                    <text > Musisz aktywować konto. </text>

                </div>

            </header>



        </div>
    );
}
export default InactiveAccount;
