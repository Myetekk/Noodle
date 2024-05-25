import React from 'react';

import '../../Styles/App.css';
import TopBar from '../../Assets/TopBar/TopBar';
import { activeStudents } from '../CoursePage/CoursePage';

function CourseMembers() {
    


    





    return (
        <div>
            


            <TopBar/>



            <div className="App-headadmin">

                <div className="">

                    <h2>Aktywni studenci</h2>
                    <div className="Tile-container">
                        { activeStudents }
                    </div>

                </div>

            </div>



        </div>
    );
}
export default CourseMembers;