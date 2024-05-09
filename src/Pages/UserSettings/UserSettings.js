import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Switch from "react-switch";

import './UserSettings.css';
import '../../App.css';
import TopBar from '../TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';





function UserSettings() {



    const [firstName, setFirstName] = useState(userInfo.first_name)
    const [lastName, setLastName] = useState(userInfo.last_name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState(userInfo.password)
    const [repeatPassword, setRepeatPassword] = useState(userInfo.password)

    const [newMarkNotify, setNewMarkNotify] = useState(userInfo.new_mark_notify)
    const [solutionSentNotify, setSolutionSentNotify] = useState(userInfo.solution_sent_notify)
    const [dateIncomingNotify, setDateIncomingNotify] = useState(userInfo.date_incoming_notify)

    const navigate = useNavigate()  // obiekt potrzebny do przechoodzenia do innej podstrony




    const handlefirstNameChange = (event) => {
        setFirstName(event.target.value)
    }
    const handlelastNameChange = (event) => {
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



    const handleNewMarkNotifyChange = () => {
        setNewMarkNotify(!newMarkNotify)
    }
    const handleSolutionSentNotifyChange = () => {
        setSolutionSentNotify(!solutionSentNotify)
    }
    const handleDateIncomingNotifyChange = () => {
        setDateIncomingNotify(!dateIncomingNotify)
    }



    const handleSubmit = (event) => {
        event.preventDefault();

        updateUserInfo()
        navigate("/home")
    }

    function updateUserInfo() {
        const userData = {
            user_id: userInfo.user_id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            new_mark_notify: newMarkNotify,
            solution_sent_notify: solutionSentNotify,
            date_incoming_notify: dateIncomingNotify
        };
        
        userInfo.first_name = firstName
        userInfo.last_name = lastName
        userInfo.email = email
        userInfo.password = password
        userInfo.new_mark_notify = newMarkNotify
        userInfo.solution_sent_notify =solutionSentNotify
        userInfo.date_incoming_notify = dateIncomingNotify
        
        axios.post( 'http://localhost:3001/api/user/updateinfo', userData )
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }





    return (
        <div>
            


            <TopBar/>



            <header className="App">

                <div className='Settings-container'>

                    <form onSubmit={handleSubmit}>
                    

                        <div className='Settings-title'>
                            <text>Ogólne</text>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>imię: </text>
                            <input className='Setting-input'
                                type='text'
                                value={firstName}
                                onChange={handlefirstNameChange}/>
                        </div>
                    

                        <div className='Setting'>
                            <text className='Setting-name'>nazwisko: </text>
                            <input className='Setting-input'
                                type='text'
                                value={lastName}
                                onChange={handlelastNameChange}/>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>email: </text>
                            <input className='Setting-input'
                                type='email'
                                value={email}
                                onChange={handleEmailChange}/>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>hasło: </text>
                            <input className='Setting-input'
                                type='password'
                                placeholder='nowe hasło'
                                value={password}
                                onChange={handlePasswordChange}/>
                            <input className='Setting-input'
                                type='password'
                                placeholder='powtórz nowe hasło'
                                value={repeatPassword}
                                onChange={handleRepeatPasswordChange}/>
                        </div>
                    





                        <div className='Setting-separator'/>
                        <div className='Settings-title'>
                            <text>Powiadomienia</text>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>nowa ocena </text>
                            <Switch className='Setting-switch'
                                onChange={handleNewMarkNotifyChange} 
                                checked={newMarkNotify} 
                                height={25}
                                onColor='#009999'/>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>przesłano rozwiązanie </text>
                            <Switch className='Setting-switch'
                                onChange={handleSolutionSentNotifyChange} 
                                checked={solutionSentNotify} 
                                height={25}
                                onColor='#009999'/>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>zbliża się termin zadania </text>
                            <Switch className='Setting-switch'
                                onChange={handleDateIncomingNotifyChange} 
                                checked={dateIncomingNotify} 
                                height={25}
                                onColor='#009999'/>
                        </div>


                        <div className="Setting-button-container" >
                            <button 
                                className='Setting-button' 
                                type='submit'>
                                    Zapisz
                            </button>
                        </div>



                    </form>

                </div>

            </header>



        </div>
    )
}

export default UserSettings
