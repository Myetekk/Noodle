import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { currentCourseInfo } from '../MainPage/MainPage';
import { currentElementInfo } from '../CoursePage/CoursePage';
import { currentSolutionInfo } from '../ElementPage/ElementPage';





function MarkSolutionPage() {

    useEffect( () => {
        ( async () => {  // tak dziwna konstrukcja żeby można było użyć async / await w useEffect
            userInfo.setData(JSON.parse(window.localStorage.getItem('userInfo')))  // sczytanie userInfo z danych zapisanych w przeglądarce 
    
            currentCourseInfo.setSelectedData({})  // czyści żeby nie wypisywać kilka razy tego samego (szczególnie przy chodzeniu 'poprzednia strona' 'następna strona')
            currentCourseInfo.setSelectedData(JSON.parse(window.localStorage.getItem('coursesInfo')))  // sczytanie userCourses z danych zapisanych w przeglądarce 
            
            currentElementInfo.setData({})
            currentElementInfo.setData(JSON.parse(window.localStorage.getItem('elementInfo')))
            setElementName(currentElementInfo.elementInfo.name)
            setDescription(currentElementInfo.elementInfo.description)
            setOpenDate(currentElementInfo.elementInfo.open_date)
            setCloseDate(currentElementInfo.elementInfo.close_date)
            
            currentSolutionInfo.setSolutionData({})
            currentSolutionInfo.setSolutionData(JSON.parse(window.localStorage.getItem('solutionInfo')))
            setUserName(currentSolutionInfo.solutionInfo.user_name)
            
            await getSolutionData()
        }) ()
    }, [])




    
    const navigate = useNavigate()
  
    const [elementName, setElementName] = useState("")
    const [description, setDescription] = useState("")
    const [openDate, setOpenDate] = useState()
    const [closeDate, setCloseDate] = useState()
    const [userName, setUserName] = useState("")

    const [grade, setGrade] = useState("")
    const [gradeComment, setGradeComment] = useState("")
    const [alerts, setAlerts] = useState("")





    const handleGradeChange = (event) => {
        setGrade(event.target.value)
    }

    const handleGradeCommentChange = (event) => {
        setGradeComment(event.target.value)
    }





    const handleSubmit = (event) => {
        event.preventDefault();
        validateData()
    }

    async function validateData() {
        if ( grade === "" ) setAlerts("wprowadź ocenę")
        else {
            setAlerts("")
            await markSolution()
            navigate("/element")
        }
    }

    async function markSolution() {
        const solutionData = { grade_: grade, grade_comment_: gradeComment, user_id_: currentSolutionInfo.solutionInfo.user_id, element_id_: currentSolutionInfo.solutionInfo.element_id}

        // ocenienie danego rozwiązania   
        axios.post( 'http://localhost:3001/api/marksolution', solutionData )
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }





    async function getSolutionData() {
        const solutionData = { user_id_: currentSolutionInfo.solutionInfo.user_id, element_id_: currentSolutionInfo.solutionInfo.element_id}

        // pobranie oceny i komentarza do rozwiązania
        await axios.post('http://localhost:3001/api/solutioninfo', solutionData)
        .then( response => {
            setGrade(response.data[0].grade)
            setGradeComment(response.data[0].grade_comment)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }





    return (
        <div>

            <TopBar/>

            <div className="App">

                <div className='Container'>

                    <div className="Element-container">
                        <div className='Title-borders'>
                            <div className="Element-container">
                                <text className='Element-title'>{elementName}</text>
                                <text className='Element-info'>{description}</text>
                            </div>
                        </div>
                    </div>
                    
                    <div className='Setting'>
                        <div className='Element-dates'>
                            <text className='Element-info'>otwarcie: {openDate}</text>
                            <text className='Element-info'>zamknięcie: {closeDate}</text>
                        </div>
                    </div>

                    <div className='Setting'>
                        <text className='Element-info'>użytkownik: {userName}</text>
                    </div>
                    
                    
                    <div className='Setting'>
                        <text className='Element-info'>[placeholder] przesłane pliki </text>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="Setting" >
                            <label className="Element-info">ocena: </label>
                            <input
                                className="Solution-mark"
                                type='text'
                                maxLength='20'
                                value={grade}
                                onChange={handleGradeChange}/>
                        </div>

                        <div className="Setting" >
                            <label className="Element-info">komentarz: </label>
                            <textarea
                                className="Course-name"
                                maxLength='200'
                                value={gradeComment}
                                onChange={handleGradeCommentChange}/>
                        </div>

                        <div className="Logging-element">
                            <span className='Logging-input-alert' >{alerts}</span>
                        </div>

                        <div className="Logging-element" >
                            <button className='Main-button' 
                                type='submit'>
                                    oceń
                            </button>
                        </div>
                    </form>

                </div>

            </div>

        </div>
    )
}

export default MarkSolutionPage
