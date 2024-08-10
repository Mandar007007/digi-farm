import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login.tsx'
import Register from './components/Auth/Register.tsx'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from './components/Nav.tsx'

function App() {

  const dispatch = useDispatch()
  const user = useSelector((state : any) => state.user.user) || {};
  
  const loadUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/me", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // console.log(data)

      if (data.user) {
        dispatch({ type: "SET_USER", payload: data.user });
        toggleLogin();
        
      } else {
        dispatch({ type: "CLEAR_USER" });
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadUser();
    // toast.success('Welcome to KisaanSathi')
  }, [])



  const routes = [
    {
      path: "/",
      name : "Home",
    },
    {
      path: "/auction",
      name : "Auction",
    },{
      path : "http://localhost:8501/" ,
      name : "Crop Prediction"
    } ,
    {
      path : "http://localhost:8502/" ,
      name : "Disease Detection"
    },
    {
      path : "/aboutus" ,
      name : "About Us"
    }

  ]


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };


  return (
    <div>
      <Router>
      <div className="mb-24 ">
      <Nav toggleLogin={toggleLogin} isLoggedIn={isLoggedIn} routes={routes} user={user} />


      </div>
        <Routes>
          {/* <Route path="/" element={<Register />} /> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App
