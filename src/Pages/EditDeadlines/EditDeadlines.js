import TopBar from "../../Assets/TopBar/TopBar";
import { currentCourseInfo } from "../MainPage/MainPage";
import { currentStudentInfo } from "../CoursePage/StudentDropdown";

function EditDeadlines(){
    return(
        <div>



            <TopBar/>



            <div className="App">


                <div className='Container'>

                <div className="Top-container">
                    <h3>{currentCourseInfo.courseInfo.course_name}</h3>
                    <text>{currentStudentInfo.studentInfo.student_id}</text>
                    <text>{currentStudentInfo.studentInfo.student_first_name}</text>
                    <text>{currentStudentInfo.studentInfo.student_last_name}</text>
                </div>

                {/* { coursesElementsVisualized } */}

                </div>


            </div>
      


        </div>
    )
}

export default EditDeadlines