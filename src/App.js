import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import LogIn from './Pages/Logging/LogIn'
import Register from './Pages/Logging/Register'
import MainPage from './Pages/MainPage/MainPage'
import InactiveAccount from './Pages/InactiveAccount/InactiveAccount'
import CoursePage from './Pages/CoursePage/CoursePage'
import UserSettings from './Pages/UserSettings/UserSettings'
import CreateCourse from './Pages/CreateCourse/CreateCourse'
import CreateElement from './Pages/CreateElement/CreateElement'
import ErrorPage from './Pages/ErrorPage/ErrorPage'
import HeadAdmin from './Pages/HeadAdmin/HeadAdmin';





function App() {



  return (
    
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/inactive-account" element={<InactiveAccount />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/create-element" element={<CreateElement />} />
          <Route path="/error-page" element={<ErrorPage />} />
          <Route path="/headadmin" element={<HeadAdmin />} />
        </Routes>
      </Router>
    
    </div>

  );
}


export default App;