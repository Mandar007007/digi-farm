import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login.tsx'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login  />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
