import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//info o wybranym studencie
class CurrentStudentInfo {
  constructor() {
    this.studentInfo = {student_id: 0, student_first_name: "", student_last_name: ""}
  }

  setStudentData({student_id, student_first_name, student_last_name}){
    this.studentInfo = {student_id: student_id, student_first_name: student_first_name, student_last_name: student_last_name}
    console.log(this.studentInfo)
  }
}

export const currentStudentInfo = new CurrentStudentInfo()





const StudentDropdown = ({id, first_name, last_name}) => {

  const navigate = useNavigate()


  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }
  const hideDropdown = () => {
    setIsOpen(false)
  }

  const handleClick = () => {
    navigateToDeadlines(id, first_name, last_name)
  }

  async function navigateToDeadlines(id, first_name, last_name){
    currentStudentInfo.setStudentData({student_id: id, student_first_name: first_name, student_last_name: last_name})
    console.log(currentStudentInfo.studentInfo.student_id + " " + 
      currentStudentInfo.studentInfo.student_first_name + " " + 
      currentStudentInfo.studentInfo.student_last_name)
    navigate("/edit-deadlines")

  }

  return (
    <div className="tile-and-dropdown">
      <div className="Tile" onClick={toggleDropdown} onBlur={hideDropdown} 
      // tabIndex={0}
      >
        <text className="Name">{first_name} {last_name}</text>
      </div>
      {isOpen &&(
        <div className="DropdownList">
          <div className="dropdown-item">Szczegóły profilu</div>
          <div className="dropdown-item">Wyślij Wiadomość</div>
          <div className="dropdown-item">Ustaw jako nieaktywnego kursanta</div>
          <div className="dropdown-item">Pobierz rozwiązania użytkownika</div>
          <div className="dropdown-item" onClick={() => navigateToDeadlines(id, first_name, last_name)}>Zarządzaj terminami</div>
          <div className="dropdown-item">Usuń kursanta</div>
        </div>
      )}
    </div>
  )
}

export default StudentDropdown