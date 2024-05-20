import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';

function CourseMembers() {

    const navigate = useNavigate()
    


    





    return (
        <div>
            


            <TopBar/>



            <div className="App-headadmin">

                <div className="">

                    <h2>Aktywni studenci</h2>
                    <div className="Tile-container">
                    </div>

                </div>

            </div>



        </div>
    );
}
export default CourseMembers;