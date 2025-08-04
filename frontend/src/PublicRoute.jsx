import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }) {
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
    return !isLoggedIn ? (
        children
    ) : (
        <Navigate to='/dashboard'/>
    )
}