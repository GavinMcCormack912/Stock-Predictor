import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { TailSpin, SpinningCircles } from 'react-loading-icons'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    async function handleRegistration(e) {
        e.preventDefault()
        const userData = {
            username, 
            email, 
            password
        }
        console.log(userData)

        try {
            setLoading(true)
            
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData)
            console.log('registration success!')
            setSuccess(true)
            setErrors({})
        }
        catch(error) {
            setErrors(error.response.data)
            console.error('Registration error: ', error.response.data)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className='container'>
                <div className="row justify-content-center">
                    <div className="col-md-6 p-5 rounded" style={{backgroundColor: "#C7C6C1"}}>
                        <h3 className='text-primary text-center mb-3'>Create an account</h3>
                        <form onSubmit={handleRegistration}>
                            {errors.username && <small><div className = "text-danger">{errors.username}</div></small>}
                            <input type="text" className='form-control mb-3' placeholder='Enter Username' value={username} onChange={((x) => setUsername(x.target.value))}/>
                            {errors.email && <small><div className = "text-danger">{errors.email}</div></small>}
                            <input type="text" className='form-control mb-3' placeholder='Enter Email' value={email} onChange={((x) => setEmail(x.target.value))}/>
                            {errors.password && <small><div className = "text-danger">{errors.password}</div></small>}
                            <input type="password" className='form-control mb-4' placeholder='Set Your Password' value={password} onChange={((x) => setPassword(x.target.value))}/>
                            {success && <div className='alert alert-success'>Successfully Registered Account!</div>}
                            {loading ? (
                                <div className="alert alert-primary" style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                                <TailSpin height="2em" width="2em" />
                                <p style={{ marginBottom: 0 }}>Please Wait...</p>
                                </div>
                            ): 
                              <button type='submit' className='button-input mb-3 d-block mx-auto rounded' >Register</button>
                            }
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}