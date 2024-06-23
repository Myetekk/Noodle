import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './SendSolutionPage.css';
import '../ElementPage/ElementPage.css';
import '../CoursePage/CoursePage.css';
import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { userInfo } from '../Logging/LogIn';
import { currentElementInfo } from '../CoursePage/CoursePage';






function SendSolutionPage() {

    useEffect( () => {
        ( async () => {  // tak dziwna konstrukcja żeby można było użyć async / await w useEffect
            userInfo.setData(JSON.parse(window.localStorage.getItem('userInfo')))  // sczytanie userInfo z danych zapisanych w przeglądarce 
    
            currentElementInfo.setData({})
            currentElementInfo.setData(JSON.parse(window.localStorage.getItem('elementInfo')))
            setElementName(currentElementInfo.elementInfo.name)
            setDescription(currentElementInfo.elementInfo.description)
            
        }) ()
    }, [])




    
    const navigate = useNavigate()
  
    const [elementName, setElementName] = useState("")
    const [description, setDescription] = useState("")

    let fileName = ""
    const fileNamePrefix = currentElementInfo.elementInfo.name + "_" + userInfo.data.last_name + "_" + userInfo.data.first_name + "_"
    const [fileNameVisualized, setFileNameVisualized] = useState("")
    const [solutionDescription, setSolutionDescription] = useState("")
    
    const [file, setFile] = useState()

    



    const handleNameChange = (event) => {
        setFileNameVisualized(event.target.value)
    }

    const handleDescriptionChange = (event) => {    
        setSolutionDescription(event.target.value)
    }

    function handleFileChange(event) {
        setFile(event.target.files[0])
    }





    const handleSubmit = (event) => {
        event.preventDefault();
        const fileExtencion = file.name.substring(file.name.indexOf("."))
        fileName = fileNamePrefix + fileNameVisualized + fileExtencion
        sendSolution()
        // navigate("/element")
    }

    async function sendSolution() {
        sendFile()
        sendFileInfo()
    }

    async function sendFile() {
        const formData = new FormData();  
        formData.append('files', fileName);
        formData.append('files', file);
        await axios.post('http://localhost:3001/api/postsolution', formData)
        .then( response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    async function sendFileInfo() {
        const data = { user_id_: userInfo.data.user_id, element_id_: currentElementInfo.elementInfo.element_id, file_name_: fileName, file_description_: solutionDescription }
        await axios.post('http://localhost:3001/api/postsolutioninfo', data)
        .then( response => {
            console.log(response.data);
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

                    <form onSubmit={handleSubmit}>
                    
                        <div className='Setting'>
                            <div>
                                <text className='File-name-title'>nazwa pliku: "</text>
                                <text className='File-name'>{fileNamePrefix}</text>
                                <input
                                    className="File-name-input"
                                    type='text'
                                    maxLength='20'
                                    value={fileNameVisualized}
                                    onChange={handleNameChange}/>
                                <text className='File-name-title'>"</text>
                            </div>
                        </div>

                        <div className="Setting" >
                            <label className="Setting-name">opis: </label>
                            <textarea
                                className="Course-name"
                                type='text'
                                maxLength='200'
                                value={solutionDescription}
                                onChange={handleDescriptionChange}/>
                        </div>

                        <div className="Setting" >
                            <label className="Setting-name">wybierz plik: </label>
                            <input
                                type='file'
                                required
                                onChange={handleFileChange}/>
                        </div>

                        <div className="Logging-element" >
                            <button className='Main-button' 
                                type='submit'>
                                    Prześlij
                            </button>
                        </div>

                    </form>

                </div>

            </div>
        
        </div>
    )
}

export default SendSolutionPage
