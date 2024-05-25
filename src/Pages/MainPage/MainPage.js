import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../../Styles/App.css';
import './MainPage.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo, userCourses, loadCourses } from '../Logging/LogIn';
import { getCoursesElementsInfo } from '../CoursePage/CoursePage';





export let courseInfo = {course_id: 0, course_name: "", course_owner: 0} 
export let coursesElements = []





function MainPage() {
    
    const navigate = useNavigate()

    const [showEnterCode, setShowEnterCode] = useState(false)
    const [accessCode, setAccessCode] = useState("")
    
    const [alerts, setAlerts] = useState("")
    



    
    const handleAccessCodeChange = (event) => {
        setAccessCode(event.target.value)
    }





    function showAddCourseButton() {
        if(userInfo.type === 2) {
          return (
            <div className="Element-list" onClick={ () => navigate('/create-course') }>
                <text className='Courses-title'>Dodaj nowy kurs</text>
            </div>
          )
        }
    }
    




    function enterCode() {
        if(showEnterCode === true) {
          return (
            <div>
                <input className='Course-access-code'
                    type='text'
                    maxLength={6}
                    placeholder='kod'
                    value={accessCode}
                    onChange={handleAccessCodeChange}/>
                <button className='Small-button'
                    onClick={ () => { checkAccessCodeExists() } }>
                    dołącz
                </button>
            </div>
          )
        }
    }

    async function checkAccessCodeExists() {
        const access_code = { access_code_: accessCode }
        let does_exists
        let course_id
        let is_user_in_course

        // sprawdza czy kurs o takim kodzie dostępu istnieje
        await axios.post('http://localhost:3001/api/accesscodeexists', access_code)
        .then( response => {
            does_exists = response.data[0].does_course_exists
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        });

        if (does_exists !== 0){
            // pobiera id kursu do którego użytkownik chce się zapisać 
            await axios.post('http://localhost:3001/api/accesscodecourseid', access_code)
            .then( response => {
                course_id = response.data[0].course_id
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            });

            // sprawdza czy użytkownik już przynależy do tego kursu
            const data = { user_id_: userInfo.user_id, course_id_: course_id }
            await axios.post('http://localhost:3001/api/isuserincourse', data)
            .then( response => {
                is_user_in_course = response.data[0].is_user_in_course
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            });

            if (is_user_in_course === 0) {
                // dodaje użytkownika do kursu
                const data = { user_id_: userInfo.user_id, course_id_: course_id }
                await axios.post('http://localhost:3001/api/addusertocourse', data)
                .then( response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                });
                


                // trzeba jakoś przeładować strone żeby pokazała kurs do którego dołączono
                await loadCourses(navigate)  // ponownie pobiera kursy użytkownika

                
            }  
            else setAlerts("Już należysz do tego kursu") 
        }
        else setAlerts("Błędny kod dostępu")
    }





    return (
        <div>
            


            <TopBar/>



            <div className="App">

                <div className='Container'>
                    
                    { userCourses }

                    <div className="Element-list" onClick={ () => setShowEnterCode(true) }>
                        <div className='Course-horizontal-div'>
                            <text className='Courses-title'>Dołącz do kursu</text>
                            { enterCode() }
                        </div>
                        <span className='Settings-input-alert'>{alerts}</span>
                    </div>

                    

                    { showAddCourseButton() }

                </div>

            </div>



        </div>
    );
}
export default MainPage;










// zeruje informacje aby uniknąć wyświetlania kilka razy to samo po przejściu 'poprzednia strona' 'następna strona'
function clearInformation() {
    courseInfo = {course_id: 0, course_name: "", course_owner: 0} 
    coursesElements = []
}










export async function getUsersCoursesInfo(navigate, userCourseId) {
    await axios.post('http://localhost:3001/api/loadcourses', userCourseId)
    .then( response => {
        const userCoursesTemp = response.data;
        
        userCoursesTemp.forEach( (element) => {
            userCourses.push(
                <div className="Element-list" onClick={() => navigateToCourse(navigate, element.course_id, element.course_name, element.course_owner)}>
                    <text className='Courses-title'>{element.course_name}</text>
                    <text className='Courses-description'>prowadzący kursu: {element.first_name} {element.last_name}</text>
                </div>
            )
        })

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}



// przekazuje informacje o wybranym (klikniętym) kursie i przekierowywuje do niego
async function navigateToCourse(navigate, current_course_id, current_course_name, current_course_owner) {

    clearInformation()
    
    courseInfo.course_id = current_course_id
    courseInfo.course_name = current_course_name
    courseInfo.course_owner = current_course_owner

    await getCoursesElements(navigate)

    navigate("/course")
}



// pobiera informacje o elementach kursu
async function getCoursesElements(navigate)  {
    const course_id = { course_id_: courseInfo.course_id }
    const courseElementId = [];
    let courseElementIdTemp;

    await axios.post('http://localhost:3001/api/courseelements', course_id)
    .then( response => {
        courseElementIdTemp = response.data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    courseElementIdTemp.forEach( (element) => {
        courseElementId.push( element.element_id )
    });

    console.log(courseElementId)

    await getCoursesElementsInfo(navigate, courseElementId)
}