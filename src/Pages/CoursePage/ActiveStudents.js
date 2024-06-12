import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDropdown from './StudentDropdown';
import { userInfo } from '../Logging/LogIn';
import { currentCourseInfo } from '../MainPage/MainPage';

const ActiveStudents = () => {
    const course_id = {course_id_ : currentCourseInfo.courseInfo.course_id, user_id_: userInfo.data.user_id}
  
    const [activeStudents, setActiveStudents] = useState([])
  
    useEffect(() => {
      axios.post('http://localhost:3001/api/loadactivestudents', course_id)
        .then(response => {
          const usersTemp = response.data
          console.log(usersTemp)
          setActiveStudents(usersTemp)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        });
    }, [])
  
    return (
      <div>
        {activeStudents.map((student) => (
          <StudentDropdown 
            key={student.id} 
            first_name={student.first_name} 
            last_name={student.last_name} 
          />
        ))}
      </div>
    )
}

export default ActiveStudents