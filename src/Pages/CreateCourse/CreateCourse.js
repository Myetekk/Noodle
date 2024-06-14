import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../../Styles/App.css';
import './CreateCourse.css';
import '../../Styles/Settings.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';





function CreateCourse() {
    
    const navigate = useNavigate()

    useEffect( () => {
        // zabezpiecza przed wchodzeniem na tą stronę przez wpisanie jej linku przez osobę nieadminową 
        if(userInfo.data.type !== 2) {
            navigate('/error-page')
        }
    })





    const [name, setName] = useState("")
    const [accessCode, setAccessCode] = useState("")
    const [alerts, setAlerts] = useState("")
    let course_id

    



    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleAccessCodeChange = (event) => {
        setAccessCode(event.target.value)
    }





    async function generateAccessCode() {
        let generatedAccessCode = Math.floor(Math.random() * (999999 - 100000) ) + 100000

        const accessCode = { access_code_: generatedAccessCode }
        await checkAccessCodeExists(accessCode)
    }
    

    
    async function checkAccessCodeExists(accessCode) {
        await axios.post('http://localhost:3001/api/accesscodeexists', accessCode)
        .then( response => {
            const does_exists = response.data[0].does_exists;
            
            if (does_exists === 0)
                generateAccessCode()
            else
                setAccessCode(accessCode.access_code_)
            
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }





    const handleSubmit = (event) => {
        event.preventDefault();        
        validateData()
    }

    async function validateData() {
        if ( name === "" ) setAlerts("wprowadź nazwe kursu")
        else if ( accessCode === "" ) setAlerts("wprowadź kod dostępu")
        else {
            setAlerts("")
            await createCourse()
            await getCourseId()
            await addUserToCourse()

            navigate("/home")
        }
    }

    async function createCourse() {
        const courseData = { course_name: name, course_owner: userInfo.data.user_id, access_code: accessCode };

        // stworzenie nowego kursu
        axios.post( 'http://localhost:3001/api/newcourse', courseData )
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }

    async function getCourseId() {
        const accessData = { access_code_: accessCode }

        // pobranie id kursu na podstawie kodu dostępu
        await axios.post('http://localhost:3001/api/accesscodecourseid', accessData)
        .then( response => {
            course_id = response.data[0].course_id
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        });
    }

    async function addUserToCourse() {
        // dodanie użytkownika do kursu
        const data = { user_id_: userInfo.data.user_id, course_id_: course_id }

        axios.post('http://localhost:3001/api/addusertocourse', data)
        .then( response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        });
    }






    return (
        <div>
        
            <TopBar/>

            <div className="App">
                
                <div className='Container'>

                    <div className='Settings-title'>
                        <text>Nowy kurs</text>
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
                            <label className="Setting-name">kod dostępu: </label>
                            <input
                                className="Course-access-code"
                                type='text'
                                maxLength='6'
                                readOnly
                                value={accessCode}
                                onChange={handleAccessCodeChange}/>
                            <button className='Small-button'
                                type='button'
                                onClick={ () => { generateAccessCode() } }
                                >generuj kod</button>
                        </div>

                        {/* TODO dodanie innych prowadzących */}

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

export default CreateCourse
