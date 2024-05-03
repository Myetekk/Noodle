import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './Logging.css';
import logo from '../../logo.svg';
// import ConditionalLink from '../../conditionalLink'





function LogIn() {



    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()



    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        checkCredentials()
    }



    function checkCredentials()  {
        
        axios.get('http://localhost:3001/api/users')
        .then( response => {
            const credentials = response.data;
            
            // sprawdzanie czy email i hasło zgadzają się z którymś z bay danych
            credentials.forEach(item => {
                if (item.email === email){
                    if (item.password === password){
                        console.log("Logged in ")
                        navigate("/")
                    }
                }
            });

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }






    return (
        <div>
            <header className="App-header">

                <img src={logo} className="App-logo" alt="logo" />

                <form onSubmit={handleSubmit}>

                    <div className="Logging-element" >
                        <label className="Logging-label">email: </label>
                        <input
                            className="Logging-input"
                            type='email'
                            value={email}
                            onChange={handleEmailChange}/>
                    </div>

                    <div className="Logging-element" >
                        <label className="Logging-label">password: </label>
                        <input
                            className="Logging-input"
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}/>
                    </div>

                    <div className="Logging-element">
                    </div>

                    <div className="Logging-element" >
                        <button 
                            className='Logging-button' 
                            type='submit'>
                                Sign in
                        </button>

                        <Link to="/register">
                            <button className='Logging-button'>Sign up</button>
                        </Link>
                    </div>

                </form>

            </header>
        </div>
    )
}

export default LogIn
