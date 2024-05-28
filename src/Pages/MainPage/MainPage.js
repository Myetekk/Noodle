import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dateFormat from 'dateformat'

import '../../Styles/App.css';
import './MainPage.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo, userCourses, getUsersCourses } from '../Logging/LogIn';





// info o otwartym kursie
class CurrentCourseInfo {
    constructor() {
        this.courseInfo = {course_id: 0, course_name: "", course_owner: 0}
        this.coursesElements = []
        this.visualCoursesElements = []
    }

    setSelectedData({course_id, course_name, course_owner}) {
        this.courseInfo = {course_id: course_id, course_name: course_name, course_owner: course_owner}
    }

    setData(coursesElements) {
        this.coursesElements = coursesElements
    }

    setVisualData(visualCoursesElements) {
        this.visualCoursesElements = visualCoursesElements
    }

    getData() {
        return this.data
    }
}
export const currentCourseInfo = new CurrentCourseInfo()





function MainPage() {

    useEffect( () => {
        userInfo.setData(JSON.parse(window.localStorage.getItem('userInfo')))  // sczytanie userInfo z danych zapisanych w przeglądarce 
        setUserType(userInfo.data.type)

        userCourses.setVisualData([])  // czyści żeby nie wypisywać kilka razy tego samego (szczególnie przy chodzeniu 'poprzednia strona' 'następna strona')
        userCourses.setData(JSON.parse(window.localStorage.getItem('userCourses')))  // sczytanie userCourses z danych zapisanych w przeglądarce 
        visualizeCoursesInfo(navigate, setUserCoursesVisualized)  // przekuwa userCourses w widok przycisków kursów
    }, [])


    
    const navigate = useNavigate()

    const [showEnterCode, setShowEnterCode] = useState(false)
    const [accessCode, setAccessCode] = useState("")
    const [userType, setUserType] = useState(0)
    const [userCoursesVisualized, setUserCoursesVisualized] = useState([])
    
    const [alerts, setAlerts] = useState("")
    



    
    const handleAccessCodeChange = (event) => {
        setAccessCode(event.target.value)
    }





    function showAddCourseButton() {
        if(userType === 2) {
          return (
            <div className="Element-list" onClick={ () => { navigate('/create-course') } }>
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
            const data = { user_id_: userInfo.data.user_id, course_id_: course_id }
            await axios.post('http://localhost:3001/api/isuserincourse', data)
            .then( response => {
                is_user_in_course = response.data[0].is_user_in_course
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            });

            if (is_user_in_course === 0) {
                // dodaje użytkownika do kursu
                const data = { user_id_: userInfo.data.user_id, course_id_: course_id }
                await axios.post('http://localhost:3001/api/addusertocourse', data)
                .then( response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                });
                
                
                await getUsersCourses()
                window.location.reload()
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
                    
                    { userCoursesVisualized }

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
    currentCourseInfo.setSelectedData({course_id: 0, course_name: "", course_owner: 0})
}










// przekuwa userCourses w widok przycisków kursów
function visualizeCoursesInfo(navigate, setUserCoursesVisualized) {
    userCourses.data.forEach( (element) => {
        userCourses.visualData.push(
            <div className="Element-list" onClick={() => navigateToCourse(navigate, element.course_id, element.course_name, element.course_owner)}>
                <text className='Courses-title'>{element.course_name}</text>
                <text className='Courses-description'>prowadzący kursu: {element.first_name} {element.last_name}</text>
            </div>
        )
    })

    setUserCoursesVisualized(userCourses.visualData)
}



// przekazuje informacje o wybranym (klikniętym) kursie i przekierowywuje do niego
async function navigateToCourse(navigate, course_id, course_name, course_owner) {
    clearInformation()

    currentCourseInfo.setSelectedData({course_id, course_name, course_owner})
    window.localStorage.setItem('coursesInfo', JSON.stringify(currentCourseInfo.courseInfo))

    await getCoursesElements()
    navigate("/course")
}



// pobiera informacje o elementach kursu
async function getCoursesElements()  {
    const course_id = { course_id_: currentCourseInfo.courseInfo.course_id }
    let courseElementId = [];

    await axios.post('http://localhost:3001/api/courseelements', course_id)
    .then( response => {
        courseElementId = response.data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    // zmiana formatu daty i godziny
    courseElementId.forEach( (element) => {
        element.open_date = dateFormat(new Date(element.open_date), "dddd dd mmmm yyyy  HH:MM", true)
        element.close_date = dateFormat(new Date(element.close_date), "dddd dd mmmm yyyy  HH:MM", true)
    } )

    // wrzucenie danych o elementach do pamięci przeglądarki
    window.localStorage.setItem('coursesElements', JSON.stringify(courseElementId))
}