import React from 'react'
import { useState } from 'react'
import axios from 'axios'
export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleRegistration(e) {
        e.preventDefault()
        const userData = {
            username, 
            email, 
            password
        }
        console.log(userData)

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData)
            console.log('response.data: ', response.data)
        }
        catch(error) {
            console.error('Registration error: ', error.response.data)
        }
    }
    return (
        <>
            <div className='container'>
                <div className="row justify-content-center">
                    <div className="col-md-6 p-5 rounded" style={{backgroundColor: "#C7C6C1"}}>
                        <h3 className='text-primary text-center mb-3'>Create an account</h3>
                        <form onSubmit={handleRegistration}>
                            <input type="text" className='form-control mb-3' placeholder='Enter Username' value={username} onChange={((x) => setUsername(x.target.value))}/>
                            <input type="text" className='form-control mb-3' placeholder='Enter Email' value={email} onChange={((x) => setEmail(x.target.value))}/>
                            <input type="password" className='form-control mb-4' placeholder='Set Your Password' value={password} onChange={((x) => setPassword(x.target.value))}/>
                            <button type='submit' className='button-input mb-3 d-block mx-auto rounded' >Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}