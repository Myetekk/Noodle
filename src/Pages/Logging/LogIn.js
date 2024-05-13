import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './Logging.css';
import logo from '../../logo.svg';
import { getUsersCourses } from '../MainPage/MainPage';





export let userInfo = {user_id: 0, first_name: "", last_name: "", email: "", password: "", type: 0, new_mark_notify: 1, solution_sent_notify: 1, date_incoming_notify: 1} 
export let userCourses = []




function LogIn() {



    const [email, setEmail] = useState("")  // email podany przy logowaniu
    const [password, setPassword] = useState("")  // hasło podany przy logowaniu

    const navigate = useNavigate()  // obiekt potrzebny do przechoodzenia do innej podstrony










    // aktualizuje email gdy użytkownik go zmieni
    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    // aktualizuje hasło gdy użytkownik go zmieni
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    // uruchamia funkcje gdy użytkownik klika 'sign in'
    const handleSubmit = (event) => {
        event.preventDefault();
        checkCredentials()
    }










    // zeruje informacje aby uniknąć wyświetlania kilka razy to samo po przejściu 'poprzednia strona' 'następna strona'
    function clearInformation() {
        userInfo = {user_id: 0, first_name: "", last_name: "", email: "", password: "", type: 0, new_mark_notify: true, solution_sent_notify: true, date_incoming_notify: true}
        userCourses = []
    }










    // sprawdza czy email i hasło zgadzają się z którymś z bazy danych
    async function checkCredentials()  {

        clearInformation()

        await axios.get('http://localhost:3001/api/users')
        .then( response => {
            const credentials = response.data;
            
            credentials.forEach( async item => {
                if (item.email === email){
                    if (item.password === password){
                        await getUsersInfo()
                        await getUsersCourses(navigate)
                        navigate("/home")
                    }
                }
            });

        })
        .catch(error => {
            console.error('Error fetching data during login:', error);
        });
    }


    


    // pobiera informacje o użytkowniku z bazy danych
    async function getUsersInfo() {
        const userEmail = { email_: email };
        
        await axios.post('http://localhost:3001/api/user/info', userEmail)
        .then( response => {
            userInfo = response.data[0];
        })
        .catch(error => {
            console.error('Error fetching data about user info:', error);
        });

    }










    return (
        <div>
            <header className="App-header">

                <img src={logo} className="Logging-app-logo" alt="logo" />

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
                        <label className="Logging-label">hasło: </label>
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
                                Zaloguj
                        </button>

                        <Link to="/register">
                            <button className='Logging-button'>Zarejestruj</button>
                        </Link>
                    </div>

                </form>

            </header>
        </div>
    )
}

export default LogIn
