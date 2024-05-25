import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Switch from "react-switch";

import '../../Styles/App.css';
import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';





function UserSettings() {



    const [firstName, setFirstName] = useState(userInfo.data.first_name)
    const [lastName, setLastName] = useState(userInfo.data.last_name)
    const [email, setEmail] = useState(userInfo.data.email)
    const [password, setPassword] = useState(userInfo.data.password)
    const [repeatPassword, setRepeatPassword] = useState(userInfo.data.password)

    const [newMarkNotify, setNewMarkNotify] = useState(userInfo.data.new_mark_notify)
    const [solutionSentNotify, setSolutionSentNotify] = useState(userInfo.data.solution_sent_notify)
    const [dateIncomingNotify, setDateIncomingNotify] = useState(userInfo.data.date_incoming_notify)

    const [alerts, setAlerts] = useState("")

    const navigate = useNavigate()  // obiekt potrzebny do przechoodzenia do innej podstrony



    

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
            updateUserInfo()
            navigate("/home")
        }
    }

    function updateUserInfo() {
        const userData = {
            user_id: userInfo.data.user_id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            new_mark_notify: newMarkNotify,
            solution_sent_notify: solutionSentNotify,
            date_incoming_notify: dateIncomingNotify
        };

        userInfo.setData({user_id: userInfo.data.user_id, first_name: firstName, last_name: lastName, email: email, password: password, type: userInfo.data.type, new_mark_notify: newMarkNotify, solution_sent_notify: solutionSentNotify, date_incoming_notify: dateIncomingNotify})

        
        // userInfo.first_name = firstName
        // userInfo.last_name = lastName
        // userInfo.email = email
        // userInfo.password = password
        // userInfo.new_mark_notify = newMarkNotify
        // userInfo.solution_sent_notify =solutionSentNotify
        // userInfo.date_incoming_notify = dateIncomingNotify
        
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



            <div className="App">

                <div className='Container'>

                    <form onSubmit={handleSubmit}>
                    

                        <div className='Settings-title'>
                            <text>Ogólne</text>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>imię: </text>
                            <input className='Setting-input'
                                type='text'
                                maxLength='20'
                                value={firstName}
                                onChange={handleFirstNameChange}/>
                        </div>
                    

                        <div className='Setting'>
                            <text className='Setting-name'>nazwisko: </text>
                            <input className='Setting-input'
                                type='text'
                                maxLength='20'
                                value={lastName}
                                onChange={handleLastNameChange}/>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>email: </text>
                            <input className='Setting-input-email'
                                type='email'
                                maxLength='40'
                                value={email}
                                onChange={handleEmailChange}/>
                        </div>
                        

                        <div className='Setting'>
                            <text className='Setting-name'>hasło: </text>
                            <input className='Setting-input-password'
                                type='password'
                                maxLength='25'
                                placeholder='nowe hasło'
                                value={password}
                                onChange={handlePasswordChange}/>
                            <input className='Setting-input-password'
                                type='password'
                                maxLength='25'
                                placeholder='powtórz nowe hasło'
                                value={repeatPassword}
                                onChange={handleRepeatPasswordChange}/>
                        </div>


                        <div className="Setting-separator">
                            <span className='Settings-input-alert' >{alerts}</span>
                        </div>
                    





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
                            <button className='Main-button' 
                                type='submit'>
                                    Zapisz
                            </button>
                        </div>



                    </form>

                </div>

            </div>



        </div>
    )
}

export default UserSettings
