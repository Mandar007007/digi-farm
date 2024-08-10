import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login.tsx'
import Register from './components/Auth/Register.tsx'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from './components/Nav.tsx'
import Home from './components/Home/Home.tsx'
import AuctionRoom from './components/Auction/AuctionRoom.tsx'
import Auction from './components/Auction/AuctionPage.tsx'
import ProfilePage from './components/Profile/ProfilePage.tsx'
import AboutUs from './components/AboutUs/AboutUs.tsx'
import History from './components/Profile/History.tsx'
import PaymentPage from './PaymentPage/PaymentPage.tsx'
import Footer from './components/Footer.tsx'

function App() {

  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user.user) || {};

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
      name: "Home",
    },
    {
      path: "/auction",
      name: "Auction",
    }, {
      path: "http://localhost:8501/",
      name: "Crop Prediction"
    },
    {
      path: "http://localhost:8502/",
      name: "Disease Detection"
    },
    {
      path: "/aboutus",
      name: "About Us"
    },
    {
      path: "/history",
      name: "History"
    }

  ]


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };


  return (
    <div className=''>
      <Router>
        <div className="mb-24 ">
          <Nav toggleLogin={toggleLogin} isLoggedIn={isLoggedIn} routes={routes} user={user} />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auction" element={<Auction isLoggedIn={isLoggedIn} user={user} />} />
          <Route path="/auctionPage" element={<AuctionRoom />} />
          <Route path="/profile" element={<ProfilePage toggleLogin={toggleLogin} isLoggedIn={isLoggedIn} user={user} dispatch={dispatch} />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/history" element={<PaymentPage />} />
          {/* <Route path="/payments" element={<PaymentPage />} /> */}
        </Routes>
      </Router>
      {/* <Footer /> */}
    </div>
  )
}

export default App
