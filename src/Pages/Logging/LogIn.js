import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './Logging.css';
import logo from '../../logo.svg';
import { courseInfo } from '../MainPage/MainPage';





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
            
            credentials.forEach( async user => {
                if (user.email === email){
                    if (user.password === password) {
                        await getUsersInfo()
                        await getUsersCourses(navigate)
                        userInfo.type !== 0 ? navigate("/home") : navigate("/inactive-account")
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





    // pobiera informacje o kursach użytkownika
    async function getUsersCourses(navigate)  {
        const user_id = { user_id_: userInfo.user_id }
        const userCourseId = [];
        let userCourseIdTemp;

        await axios.post('http://localhost:3001/api/usercourses', user_id)
        .then( response => {
            userCourseIdTemp = response.data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        userCourseIdTemp.forEach( (element) => {
            userCourseId.push( element.course_id )
        });

        await getUsersCoursesInfo(navigate, userCourseId)
    }



    async function getUsersCoursesInfo(navigate, userCourseId) {

        console.log(userCourseId)
        await axios.post('http://localhost:3001/api/loadcourses', userCourseId)
        .then( response => {
            const userCoursesTemp = response.data;
            
            userCoursesTemp.forEach( (element) => {
                userCourses.push(
                    <div className="Courses" onClick={() => navigateToCourse(navigate, element.course_id, element.course_name, element.course_owner)}>
                        <text className='Courses-title'>{element.course_name}</text>
                        <text className='Courses-description'>prowadzący kursu: {element.course_owner}</text>
                    </div>
                )
            })

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }



    // przekazuje informacje o wybranym (klikniętym) kursie i przekierowywuje do niego
    function navigateToCourse(navigate, current_course_id, current_course_name, current_course_owner) {
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
