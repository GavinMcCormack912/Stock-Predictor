import { useState, useContext, createContext } from 'react'


// Create the context
const AuthContext = createContext();


export default function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('accessToken')
    )

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
} 

export {AuthContext};