import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './ElementPage.css';
import '../CoursePage/CoursePage.css';
import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { currentElementInfo } from '../CoursePage/CoursePage';





function ElementPage() {

    useEffect( () => {
        userInfo.setData(JSON.parse(window.localStorage.getItem('userInfo')))  // sczytanie userInfo z danych zapisanych w przeglądarce 
        
        currentElementInfo.setData({})
        currentElementInfo.setData(JSON.parse(window.localStorage.getItem('elementInfo')))
        setElementName(currentElementInfo.elementInfo.name)
        setDescription(currentElementInfo.elementInfo.description)
        setOpenDate(currentElementInfo.elementInfo.open_date)
        setCloseDate(currentElementInfo.elementInfo.close_date)
    }, [])




    
    const navigate = useNavigate()
  
    const [elementName, setElementName] = useState("")
    const [description, setDescription] = useState("")
    const [openDate, setOpenDate] = useState()
    const [closeDate, setCloseDate] = useState()





    return (
        <div>

            <TopBar/>

            <div className="App">

                <div className='Container'>

                    <div className="Element-container">
                        <text className='Element-title'>{elementName}</text>
                        <text className='Element-description'>{description}</text>
                    </div>
                    
                    <div className="Element-container">
                        <text className='Element-dates'>otwarcie: {openDate}</text>
                        <text className='Element-dates'>zamknięcie: {closeDate}</text>
                    </div>


                </div>

            </div>

        </div>
    )
}

export default ElementPage
