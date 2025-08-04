import {useContext, useState} from 'react' 
import Button from './Button'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome } from "react-icons/fa";
import { AuthContext } from '../AuthProvider';

export default function Navbar() {
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
    const nav = useNavigate()

    function handleLogout(){
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setIsLoggedIn(false)
        nav('/login')
    }
    return (
        <nav className='navbar container pt-3 pb-3 align-items-start'>
         <Link className='navbar-brand text-light border border-secondary rounded p-2 home-link' to="/"><FaHome style={{ marginBottom: "0.25em"}}/> Stock Prediction</Link>

         <div>
            {isLoggedIn ? (
                <>
                <Button classes="btn-warning me-1" path="/dashboard"> DashBoard </Button>
                <button onClick={handleLogout} className='btn btn-danger'> Logout </button>
                
                </>
            ) : (
            <>
                <Button classes="btn-warning me-1" path="/login">Login</Button>
                <Button classes="btn-outline-warning me-1" path="/register">Register Account</Button>
            </>
            )}
         </div>
        </nav>
    )
}