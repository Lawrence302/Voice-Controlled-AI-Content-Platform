
import './App.css'
import About from './pages/About'
import Home from './pages/home'
import Contact from './pages/contact'
import Header from './components/header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
 

  return (
    <>
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
      </Routes>

    </Router>
      
      
    </>
  )
}

export default App
