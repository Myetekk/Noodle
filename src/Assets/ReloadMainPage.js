import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function ReloadMainPage() {

    const navigate = useNavigate()  // obiekt potrzebny do przechoodzenia do innej podstrony

    useEffect( () => {
        navigate("/home")
    })



    return (
        <div>
            
        </div>
    )
}

export default ReloadMainPage
