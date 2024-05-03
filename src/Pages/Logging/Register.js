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
        console.log("firstName: ", firstName)
        console.log("lastName: ", lastName)
        console.log("email: ", email)
        console.log("Password: ", password)
        console.log("repeatPassword: ", repeatPassword)
        
        validateData()
    }

    function validateData() {
        if (firstName === "") setAlerts("enter your first name")
        else if (lastName === "") setAlerts("enter your last name")
        else if (email === "") setAlerts("enter your email")
        else if (password === "") setAlerts("enter your password")
        else if (repeatPassword === "") setAlerts("repeat your password")
        else if (email.slice(email.indexOf("@")+1) !== "student.polsl.pl"  &&  email.slice(email.indexOf("@")+1) !== "polsl.pl") setAlerts("email must be on domain @polsl.pl or @student.polsl.pl")
        else if (password.length < 5) setAlerts("password must be longer than 5")
        else if (password !== repeatPassword) setAlerts("passwords are different")
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
            admin: 0
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
        <header className="App-header">

            <img src={logo} className="App-logo" alt="logo" />

            <form onSubmit={handleSubmit}>

                <div className="Logging-element" >
                    <label className="Logging-label">First name: </label>
                    <input
                        className="Logging-input"
                        type='text'
                        value={firstName}
                        onChange={handleFirstNameChange}/>
                </div>

                <div className="Logging-element" >
                    <label className="Logging-label">Last Name: </label>
                    <input
                        className="Logging-input"
                        type='text'
                        value={lastName}
                        onChange={handleLastNameChange}/>
                </div>

                <div className="Logging-element" >
                    <label className="Logging-label">E mail: </label>
                    <input
                        className="Logging-input"
                        type='email'
                        value={email}
                        onChange={handleEmailChange}/>
                </div>

                <div className="Logging-element" >
                    <label className="Logging-label">Password: </label>
                    <input
                        className="Logging-input"
                        type='password'
                        value={password}
                        onChange={handlePasswordChange}/>
                </div>

                <div className="Logging-element" >
                    <label className="Logging-label">Repeat password: </label>
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
                            Sign up
                    </button>
                </div>
                
            </form>

        </header>
    </div>
  )
}

export default Register
