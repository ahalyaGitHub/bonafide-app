import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Home from './components/home/Home';
import Apply from './components/apply/Apply';
import TrackApplication from './components/trackApplication/TrackApplication';
import Profile from './components/profile/Profile';
import StaffDashboard from './components/staffDashboard/StaffDashboard';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); 
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login/>} />    
        <Route path='/login/staff' element={<Login isStaff/>} />    
        <Route path='/track' element={<TrackApplication />} />   
        <Route path='/profile' element={<Profile />} />    
        <Route path='/staffDashboard' element={<StaffDashboard />} />    

         
        <Route path="/apply" element={
          <ProtectedRoute>
            <Apply />
          </ProtectedRoute>
        } />  
      </Routes>
    </Router>
    <ToastContainer />
    </>
  )
}
