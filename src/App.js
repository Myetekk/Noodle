import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LogIn from './Pages/Logging/LogIn'
import Register from './Pages/Logging/Register'
import MainPage from './Pages/MainPage/MainPage'
import CoursePage from './Pages/CoursePage/CoursePage'
import UserSettings from './Pages/UserSettings/UserSettings'
import CreateCourse from './Pages/CreateCourse/CreateCourse'
import CreateElement from './Pages/CreateElement/CreateElement'
import ErrorPage from './Pages/ErrorPage/ErrorPage'
import HeadAdmin from './Pages/HeadAdmin/HeadAdmin'
import CourseMembers from './Pages/CourseMembers/CourseMembers'
import InactiveAccount from './Pages/InactiveAccount/InactiveAccount'
import ReloadMainPage from './Assets/ReloadMainPage'





function App() {



  return (
    
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/create-element" element={<CreateElement />} />
          <Route path="/error-page" element={<ErrorPage />} />
          <Route path="/headadmin" element={<HeadAdmin />} />
          <Route path="/course-members" element={<CourseMembers />} />
          
          <Route path="/inactive-account" element={<InactiveAccount />} />
          <Route path="/reload-main-page" element={<ReloadMainPage />} />

        </Routes>
      </Router>
    
    </div>

  );
}


export default App;