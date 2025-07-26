import React from 'react' 
import Button from './Button'
import { Link } from 'react-router-dom'
import { FaHome } from "react-icons/fa";

export default function Navbar() {
    return (
        <nav className='navbar container pt-3 pb-3 align-items-start'>
         <Link className='navbar-brand text-light' to="/">Stock Prediction Home</Link>

         <div>
            <Button classes="btn-warning me-1" path="/login">Login</Button>
            <Button classes="btn-outline-warning me-1" path="/register">Register Account</Button>
         </div>
        </nav>
    )
}