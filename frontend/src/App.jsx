import './App.css'
import './assets/css/styles.css'
import Home from './components/Home.jsx'
import { Route, Routes, BrowserRouter } from "react-router-dom"
import Register from './components/Register.jsx'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login.jsx'
import AuthProvider from './AuthProvider.jsx'
function App() {

  return ( 
  <>
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />
          </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </>
  )
}

export default App
