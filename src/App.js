import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// import LoggingSystem from './Pages/Logging/LoggingSystem'
import LogIn from './Pages/Logging/LogIn'
// import Registration from './Pages/Logging/Registration'
import Register from './Pages/Logging/Register'
import MainPage from './Pages/MainPage/MainPage'





function App() {



  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<MainPage />} />
        </Routes>
      </Router>
    
    </div>

  );
}


export default App;