import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './Logging.css';
import logo from '../../logo.svg';
import { getUsersCoursesInfo } from '../MainPage/MainPage';
import { getUserTypes } from '../HeadAdmin/HeadAdmin';





export let userInfo = {user_id: 0, first_name: "", last_name: "", email: "", password: "", type: 0, new_mark_notify: 1, solution_sent_notify: 1, date_incoming_notify: 1} 
export let userCourses = []
export let students = []
export let admins = []




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
                        if (userInfo.type === 0){
                            navigate("/inactive-account")
                        }
                        else if (userInfo.type === 1 || userInfo.type === 2){
                            await getUsersCourses(navigate)                            
                            navigate("/home")
                        }
                        else{
                            await getUserTypes()
                            navigate("/headadmin")
                        }                        
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





    async function getUserTypes(){
        await getSpecificType(1)
        await getSpecificType(2)
    }


    // pobiera informacje o użytkownikach z danym typem
    async function getSpecificType(userType){
        const type = {type_: userType};
        await axios.post('http://localhost:3001/api/headadmin', type)
        .then(response => {
            const usersTemp = response.data;
            if (userType === 1){
                students.length = 0
            usersTemp.forEach((element) => {
                students.push(
                    <div className="Tile">
                        <text className="Name">{element.first_name} {element.last_name}</text>
                    </div>
                )
            });
            }
            else {
                admins.length = 0
                usersTemp.forEach((element) => {
                    admins.push(
                        <div className="Tile">
                            <text className="Name">{element.first_name} {element.last_name}</text>
                        </div>
                    )
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }





    return (
        <div>
            <div className="App-header">

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
                            className='Main-button' 
                            type='submit'>
                                Zaloguj
                        </button>

                        <button className='Main-button' onClick={ () => { navigate("/register") } }>Zarejestruj</button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default LogIn
