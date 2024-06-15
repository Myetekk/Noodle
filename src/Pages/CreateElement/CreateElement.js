import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import dateFormat from 'dateformat'

import '../../Styles/App.css';
import "react-datepicker/dist/react-datepicker.css";
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { currentCourseInfo } from '../MainPage/MainPage';





function CreateElement() {
    
    const navigate = useNavigate()

    useEffect( () => {
        // zabezpiecza przed wchodzeniem na tą stronę przez wpisanie jej linku przez osobę nieadminową 
        if(userInfo.data.type !== 2) {
            navigate('/error-page')
        }

        currentCourseInfo.setSelectedData(JSON.parse(window.localStorage.getItem('coursesInfo')))  // sczytanie userCourses z danych zapisanych w przeglądarce 
    })





    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [openDate, setOpenDate] = useState(new Date())
    const [closeDate, setCloseDate] = useState(new Date())
    const [alerts, setAlerts] = useState("")

    



    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }





    const handleSubmit = (event) => {
        event.preventDefault();
        validateData()
    }

    async function validateData() {
        if ( name === "" ) setAlerts("wprowadź nazwe elementu")
        else if ( description === "" ) setAlerts("wprowadź opis elementu")
        else {
            setAlerts("")
            await createElement()
            navigate("/course")
        }
    }

    async function createElement() {
        const elementData = { name: name, description: description, type: 0, open_date: dateFormat(new Date(openDate), "yyyy-mm-dd'T'HH:MM:00.000'Z'"), close_date: dateFormat(new Date(closeDate), "yyyy-mm-dd'T'HH:MM:00.000'Z'"), course_id: currentCourseInfo.courseInfo.course_id }

        // stworzenie nowego elementu   
        axios.post( 'http://localhost:3001/api/newelement', elementData )
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

                    <div className='Settings-title'>
                        <text>Nowy element</text>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="Setting" >
                            <label className="Setting-name">nazwa: </label>
                            <input
                                className="Course-name"
                                type='text'
                                maxLength='40'
                                value={name}
                                onChange={handleNameChange}/>
                        </div>

                        <div className="Setting" >
                            <label className="Setting-name">opis: </label>
                            <textarea
                                className="Course-name"
                                type='text'
                                maxLength='200'
                                value={description}
                                onChange={handleDescriptionChange}/>
                        </div>

                        <div className="Setting" >
                            <label className="Setting-name">data otwarcia: </label>
                            <DatePicker 
                                className='Setting-date'
                                selected={openDate}
                                onChange={ (date) => setOpenDate(date) }
                                dateFormat={"dd.MM.yyyy ' ' HH:mm"}
                                timeInputLabel="Time:"
                                showTimeInput
                                withPortal
                            />
                        </div>

                        <div className="Setting" >
                            <label className="Setting-name">data zamknięcia: </label>
                            <DatePicker 
                                className='Setting-date'
                                selected={closeDate}
                                onChange={ (date) => setCloseDate(date) }
                                dateFormat={"dd.MM.yyyy ' ' HH:mm"}
                                timeInputLabel="Time:"
                                showTimeInput
                                withPortal
                            />
                        </div>


                        <div className="Logging-element">
                            <span className='Logging-input-alert' >{alerts}</span>
                        </div>

                        <div className="Logging-element" >
                            <button className='Main-button' 
                                type='submit'>
                                    Stwórz
                            </button>
                        </div>
                        
                    </form>

                </div>

            </div>

        </div>
    )
}

export default CreateElement
