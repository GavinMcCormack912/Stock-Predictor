import React from 'react' 
import Button from './Button'
export default function Navbar() {
    return (
        <nav className='navbar container pt-3 pb-3 align-items-start'>
         <a className='navbar-brand text-light' href="">Stock Prediction Home</a>

         <div>
            <Button classes="btn-warning me-1">Login</Button>
            <Button classes="btn-outline-warning me-1">Register Account</Button>
         </div>
        </nav>
    )
}