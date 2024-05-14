import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './HeadAdmin.css';
import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo, userCourses } from '../Logging/LogIn';








function HeadAdmin() {
    
    const navigate = useNavigate()
    

    let admins = []
    let users = []

    





    return (
        <div>
            


            <TopBar/>



            <div className="App">

                <div className="HeadAdmin">

                    <h2>Obecni admini</h2>
                    <div className="Tile-container">
                        <div className="Tile">
                            <text className="Name">Mariusz Pudzianowski</text>
                        </div>
                        <div className="Tile">
                            <text className="Name">Mariusz Pudzianowski</text>
                        </div>
                        <div className="Tile">
                            <text className="Name">Mariusz Pudzianowski</text>
                        </div>
                        <div className="Tile">
                            <text className="Name">Mariusz Pudzianowski</text>
                        </div>
                    </div>

                    <h2>Wszyscy użytkownicy</h2>
                    <div className="Tile-container">
                        <div className="Tile">
                            <text className="Name">Mirosław Michalik</text>
                        </div>
                        <div className="Tile">
                            <text className="Name">Paweł Kasztura</text>
                        </div>
                        <div className="Tile">
                            <text className="Name">Szymon Jakubiec</text>
                        </div>
                        <div className="Tile">
                            <text className="Name">Michał Soboszek</text>
                        </div>
                        <div className="Tile">
                            <text className="Name">Andrzej Marian</text>
                        </div>
                    </div>

                </div>

            </div>



        </div>
    );
}
export default HeadAdmin;
