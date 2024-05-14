import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './Logging.css';
import logo from '../../logo.svg';





function Register() {
    
    

    
    
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [alerts, setAlerts] = useState("")

    const navigate = useNavigate()

    



    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value)
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value)
    }





    const handleSubmit = (event) => {
        event.preventDefault();        
        validateData()
    }

    function validateData() {
        if (firstName === "") setAlerts("wprowadź imię")
        else if (lastName === "") setAlerts("wprowadź nazwisko")
        else if (email === "") setAlerts("wprowadź email")
        else if (password === "") setAlerts("wprowadź hasło")
        else if (repeatPassword === "") setAlerts("powtórz hasło")
        else if (email.slice(email.indexOf("@")+1) !== "student.polsl.pl"  &&  email.slice(email.indexOf("@")+1) !== "polsl.pl") setAlerts("email musi być w domenie @polsl.pl lub @student.polsl.pl")
        else if (password.length < 5) setAlerts("hasło musi być dłuższe niż 8")
        else if (password !== repeatPassword) setAlerts("hasła się różnią")
        else {
            setAlerts("")
            addNewUser()
            navigate("/")
        }
    }

    function addNewUser() {
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            type: 0
        };
        
        axios.post( 'http://localhost:3001/api/newUser', userData )
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }





    return (
        <div>
            <div className="App-header">

                <img src={logo} className="Logging-app-logo" alt="logo" />

                <form onSubmit={handleSubmit}>

                    <div className="Logging-element" >
                        <label className="Logging-label">imię: </label>
                        <input
                            className="Logging-input"
                            type='text'
                            value={firstName}
                            onChange={handleFirstNameChange}/>
                    </div>

                    <div className="Logging-element" >
                        <label className="Logging-label">nazwisko: </label>
                        <input
                            className="Logging-input"
                            type='text'
                            value={lastName}
                            onChange={handleLastNameChange}/>
                    </div>

                    <div className="Logging-element" >
                        <label className="Logging-label">email: </label>
                        <input
                            className="Logging-input"
                            type='email'
                            value={email}
                            onChange={handleEmailChange}/>
                    </div>

                    <div className="Logging-element" >
                        <label className="Logging-label">hasło: </label>
                        <input
                            className="Logging-input"
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}/>
                    </div>

                    <div className="Logging-element" >
                        <label className="Logging-label">powtórz hasło: </label>
                        <input
                            className="Logging-input"
                            type='password'
                            value={repeatPassword}
                            onChange={handleRepeatPasswordChange}/>
                    </div>

                    <div className="Logging-element">
                        <span className='Logging-input-alert' >{alerts}</span>
                    </div>


                    <div className="Logging-element" >
                        <button 
                            className='Logging-button' 
                            type='submit'>
                                Zarejestruj
                        </button>
                    </div>
                    
                </form>

            </div>
        </div>
    )
}

export default Register
