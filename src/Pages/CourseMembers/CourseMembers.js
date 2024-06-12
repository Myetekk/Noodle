import React from 'react';

import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { activeStudents } from '../CoursePage/CoursePage';
import ActiveStudents from '../CoursePage/ActiveStudents';

function CourseMembers() {
    


    





    return (
        <div>
            


            <TopBar/>



            <div className="App-headadmin">

                <div className="">

                    <h2>Aktywni studenci</h2>
                    <div className="Tile-container">
                        <ActiveStudents/>
                    </div>

                </div>

            </div>



        </div>
    );
}
export default CourseMembers;