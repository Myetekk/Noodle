import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import '../../Styles/App.css';
import './CreateCourse.css';
import '../../Styles/Settings.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';





function CreateCourse() {
    
    const navigate = useNavigate()

    useEffect( () => {
        if(userInfo.type !== 2) {
            navigate('/error-page')
        }
    })





    const [name, setName] = useState("")
    const [accessCode, setAccessCode] = useState("")
    const [alerts, setAlerts] = useState("")

    



    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleAccessCodeChange = (event) => {
        setAccessCode(event.target.value)
    }





    const handleSubmit = (event) => {
        event.preventDefault();        
        validateData()
    }

    function validateData() {
        if ( name === "" ) setAlerts("wprowadź nazwe kursu")
        else if ( accessCode === "" ) setAlerts("wprowadź kod dostępu")
        else if ( accessCode.length !== 6 ) setAlerts("kod dostępu musi mieć długość 6")
        else {
            
        }
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
                            <button className='Small-button'>generuj kod</button>
                        </div>

                        <div className="Logging-element">
                            <span className='Logging-input-alert' >{alerts}</span>
                        </div>

                        <div className="Logging-element" >
                            <button 
                                className='Main-button' 
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
