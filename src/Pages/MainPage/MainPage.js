import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './MainPage.css';
import logo from '../../logo.svg';





function MainPage() {



  return (
    <div>

        <div>
            <header className="App-header">

            <img src={logo} className="App-logo" alt="logo" />

            <div className="Logging-element" >
                <text>Główna strona</text>
            </div>

            <div className="Logging-element" >
                <Link to="/login">
                    <button className='Logging-button'>Sign in</button>
                </Link>
            </div>

            </header>
        </div>
    
    </div>

  );
}


export default MainPage;