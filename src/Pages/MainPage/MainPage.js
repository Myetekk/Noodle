import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './MainPage.css';
import logo from '../../logo.svg';
import { userInfo } from '../Logging/LogIn';





function MainPage() {
    
    

    return (
        <div className='Top-bar-app'>
            <div className='Top-bar'>
                <img src={logo} className="Top-bar-app-logo" alt="logo" />
                <text className='Top-bar-text'>Hello, {userInfo.first_name}</text>
            </div>


            <header className="App-header">


                




                <div className="Logging-element" >
                    <text>Główna strona</text>
                </div>

                <div className="Logging-element" >
                    
                </div>

            </header>
        
        </div>

    );
}


export default MainPage;