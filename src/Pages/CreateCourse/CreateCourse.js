import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import '../../App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';





function CreateCourse() {
    
    const navigate = useNavigate()

    useEffect( () => {
        if(userInfo.type !== 2) {
            navigate('/error-page')
        }
    })





    return (
        <div>
        
            <TopBar/>

            <div className="App">
                
                <div className='Container'>

                    <text>Nowy kurs</text>

                </div>
                
            </div>

        </div>
    )
}

export default CreateCourse