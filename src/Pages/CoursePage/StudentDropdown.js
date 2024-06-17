import React, { useState } from 'react';

const StudentDropdown = ({first_name, last_name}) => {
    const [isOpen, setIsOpen] = useState(false)
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen)
    }
    const hideDropdown = () => {
      setIsOpen(false)
    }
  
    return (
      <div className="tile-and-dropdown">
        <div className="Tile" onClick={toggleDropdown} onBlur={hideDropdown} tabIndex={0}>
          <text className="Name">{first_name} {last_name}</text>
        </div>
        {isOpen &&(
          <ul className="DropdownList">
            <li className="dropdown-item">Szczegóły profilu</li>
            <li className="dropdown-item">Wyślij Wiadomość</li>
            <li className="dropdown-item">Ustaw jako nieaktywnego kursanta</li>
            <li className="dropdown-item">Pobierz rozwiązania użytkownika</li>
            <li className="dropdown-item">Zarządzaj terminami</li>
            <li className="dropdown-item">Usuń kursanta</li>
          </ul>
          
        )}
      </div>
    )
}

export default StudentDropdown