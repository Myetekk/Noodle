import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import LogIn from './Pages/Logging/LogIn'
import Register from './Pages/Logging/Register'
import MainPage from './Pages/MainPage/MainPage'
import CoursePage from './Pages/CoursePage/CoursePage'





function App() {



  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/course" element={<CoursePage />} />
        </Routes>
      </Router>
    
    </div>

  );
}


export default App;