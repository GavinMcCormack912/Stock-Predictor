import React from 'react'
import { useState, useContext } from 'react'
import axios from 'axios'
import { TailSpin } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'


export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        const userData = {username,password}

        try {
            setLoading(true)
            
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData)
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            console.log('login success!')
            setSuccess(true)
            setIsLoggedIn(true)
            navigate('/')
        }
        catch(error) {
            setError('Invalid Credentials!!')
            console.error('Login error: ', error.response.data)
        }
        finally {
            setLoading(false)
        }
    }
    return (
       <>
            <div className='container'>
                <div className="row justify-content-center">
                    <div className="col-md-6 p-5 rounded" style={{backgroundColor: "#c1c2a6ff"}}>
                        <h3 className='text-primary text-center mb-3'>Login to Your Account</h3>
                        <form onSubmit={handleLogin}>
                            <input type="text" className='form-control mb-3' placeholder='Enter Username' value={username} onChange={((x) => setUsername(x.target.value))}/>
                            <input type="password" className='form-control mb-4' placeholder='Enter Password' value={password} onChange={((x) => setPassword(x.target.value))}/>
                            {error && <small><div className = "text-danger text-center mb-3">{error}</div></small>}
                            {loading ? (
                                <div className="alert alert-primary" style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                                <TailSpin height="2em" width="2em" />
                                <p style={{ marginBottom: 0 }}>Please Wait...</p>
                                </div>
                            ): 
                                <button type='submit' className='button-input mb-3 d-block mx-auto rounded' >Login</button>
                            }
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}