import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './Logging.css';
import logo from '../../logo.svg';
import { courseInfo } from '../MainPage/MainPage';





export let userInfo = {user_id: 0, user_first_name: "", user_last_name: "", user_email: "", user_password: "", user_courses: "", user_type: 0} 
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










    // sprawdza czy email i hasło zgadzają się z którymś z bay danych
    async function checkCredentials()  {
        await axios.get('http://localhost:3001/api/users')
        .then( response => {
            const credentials = response.data;
            
            credentials.forEach( async item => {
                if (item.email === email){
                    if (item.password === password){
                        await getUsersInfo()
                        await getUsersCoursesFromDatabase()
                        navigate("/home")
                    }
                }
            });

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }


    


    // pobiera informacje o użytkowniku z bazy danych
    async function getUsersInfo() {
        const userEmail = { email_: email };
        // console.log("email: " + email)
        // console.log("userEmail: " + userEmail.email_)
        
        await axios.post('http://localhost:3001/api/user/info', userEmail)
        .then( response => {
            userInfo = response.data[0];
            // console.log("response.data[0]: " + response)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    }





    // pobiera informacje o kursach użytkownika
    async function getUsersCoursesFromDatabase()  {
        const course_id = { course_id_: userInfo.user_courses };
        // console.log("login 1: " + userInfo.user_courses)

        await axios.post('http://localhost:3001/api/userscourses', course_id)
        .then( response => {
            const userCoursesTemp = response.data;
            
            userCoursesTemp.forEach( (element) => {
                userCourses.push(
                    <div className="Course" onClick={() => navigateToCourse(element.course_id, element.course_name, element.course_owner)}>
                        <text className='Course-title'>{element.course_name}</text>
                        <text className='Course-description'>prowadzący kursu: {element.course_owner}</text>
                    </div>
                )
            })

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    // przekazuje informacje o wybranym (klikniętym) kursie i przekierowywuje do niego
    function navigateToCourse(current_course_id, current_course_name, current_course_owner) {
        courseInfo.course_id = current_course_id
        courseInfo.course_name = current_course_name
        courseInfo.course_owner = current_course_owner
        navigate("/course")
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
