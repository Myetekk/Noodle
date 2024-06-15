import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';

import './ElementPage.css';
import '../CoursePage/CoursePage.css';
import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { currentCourseInfo } from '../MainPage/MainPage';
import { currentElementInfo } from '../CoursePage/CoursePage';





// info o otwartym rozwiązaniu
class CurrentSolutionInfo {
  constructor() {
    this.solutionInfo = {course_id: 0, element_id: 0, user_id: 0, user_name: ""}
  }

  setSolutionData({course_id, element_id, user_id, user_name}) {
    this.solutionInfo = {course_id: course_id, element_id: element_id, user_id: user_id, user_name: user_name}
  }
}
export const currentSolutionInfo = new CurrentSolutionInfo()





function ElementPage() {

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
    
            await getUsersStatus(currentElementInfo.elementInfo.element_id)
    
            currentElementInfo.setUserStatus([])
            currentElementInfo.setUserStatusVisualized([])
            currentElementInfo.setUserStatus(JSON.parse(window.localStorage.getItem('usersStatus')))  // sczytanie usersStatus z danych zapisanych w przeglądarce 
            visualizeUserStatus()
        }) ()
    }, [])




    
    const navigate = useNavigate()
  
    const [elementName, setElementName] = useState("")
    const [description, setDescription] = useState("")
    const [openDate, setOpenDate] = useState()
    const [closeDate, setCloseDate] = useState()

    const [userStatusVisualized, setUserStatusVisualized] = useState([])
    const [userGrade, setGrade] = useState("")
    const [userGradeComment, setGradeComment] = useState("")





    // sprawdza czy użytkownik jest właścicielem danego kursu
    function isCourseOwner() {
      return userInfo.data.user_id === currentCourseInfo.courseInfo.course_owner
    }





    function LoadThings() {
        if (isCourseOwner()){
            return(
                <div className='Table-borders'>
                    <Table bordered variant='dark'>
                        <thead>
                            <tr>
                                <th>Imię</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            { userStatusVisualized }
                        </tbody>
                    </Table>
                </div>
            )
        }
        else {
            return(
                <div className='Table-borders'>
                    <div className='Element-status'>
                        <text className='Element-info'>status: { userStatusVisualized }</text>
                        <text className='Element-info'>ocena: { userGrade }</text>
                        <text className='Element-info'>komentarz: { userGradeComment }</text>
                    </div>
                </div>
            )
        }
    }





    async function visualizeUserStatus() {
        let status = ""
        if (isCourseOwner()){
            currentElementInfo.elementUsersStatus.forEach( (element) => {
                if (element.grade === "0") status = ""
                else status = element.grade

                let user_name = element.last_name + " " + element.first_name

                currentElementInfo.elementUsersStatusVisualized.push(
                    <tr>
                        <td onClick={ () => navigateToMarkSolution(element.user_id, user_name) }>{ element.last_name } {element.first_name}</td>
                        <td>{ status }</td>
                    </tr>
                )
            })

            setUserStatusVisualized(currentElementInfo.elementUsersStatusVisualized)
        }
        else {
            const data = { user_id_: userInfo.data.user_id, element_id_: currentElementInfo.elementInfo.element_id }
            let solutionsGrade = ""
            let solutionsGradeComment = ""

            await axios.post('http://localhost:3001/api/userssolutionstatus', data)
            .then( response => {
                solutionsGrade = response.data[0].grade;
                solutionsGradeComment = response.data[0].grade_comment;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

            if (solutionsGrade === "0") setUserStatusVisualized("przesłano")
            else {
                setUserStatusVisualized("oceniono")
                setGrade(solutionsGrade)
                setGradeComment(solutionsGradeComment)
            }
        }
    }





    async function navigateToMarkSolution(user_id, user_name) {
        currentSolutionInfo.setSolutionData({course_id: 0, element_id: 0, user_id: 0, user_name: ""})  // user_id to id osoby która przesłała rozwiązanie

        currentSolutionInfo.setSolutionData({course_id: currentCourseInfo.courseInfo.course_id, element_id: currentElementInfo.elementInfo.element_id, user_id: user_id, user_name: user_name})
        window.localStorage.setItem('solutionInfo', JSON.stringify(currentSolutionInfo.solutionInfo))

        navigate("/mark-solution")
    }





    async function getUsersStatus(element_id) {
      const data = { element_id_: element_id }
      let usersStatus = [];
    
      await axios.post('http://localhost:3001/api/usersstatus', data)
      .then( response => {
        usersStatus = response.data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    
      // wrzucenie danych o statusach do pamięci przeglądarki
      window.localStorage.setItem('usersStatus', JSON.stringify(usersStatus))
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

                    <div className="Element-container">
                        { LoadThings() }
                    </div>


                </div>

            </div>

        </div>
    )
}

export default ElementPage