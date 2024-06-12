import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const StudentDropdown = ({first_name, last_name}) => {
    const [isOpen, setIsOpen] = useState(false)
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen)
    }
  
    return (
      <Dropdown show={isOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle className="Tile" id={`dropdown-${first_name}-${last_name}`}>
          <text className="Name">{first_name} {last_name}</text>
        </Dropdown.Toggle>
  
        <Dropdown.Menu className='DropdownList'>
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
}

export default StudentDropdown