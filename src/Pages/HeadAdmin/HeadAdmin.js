import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import '../../Styles/App.css';
import './HeadAdmin.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
// import { response } from 'express';
import { students, admins } from '../Logging/LogIn';




function HeadAdmin() {
    
    const navigate = useNavigate()
    


    





    return (
        <div>
            


            <TopBar/>



            <div className="App-headadmin">

                <div className="HeadAdmin">

                    <h2>Obecni admini</h2>
                    <div className="Tile-container">
                        { admins }
                    </div>

                    <h2>Wszyscy użytkownicy</h2>
                    <div className="Tile-container">
                        { students }
                    </div>

                </div>

            </div>



        </div>
    );
}
export default HeadAdmin;