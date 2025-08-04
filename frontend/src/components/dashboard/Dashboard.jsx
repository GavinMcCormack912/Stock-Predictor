import { useEffect } from "react"
import axios from "axios"
import axiosInstance from "../../axiosInstance"
export default function Dashboard({children}) {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    useEffect(() => {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstance.get('/protected-view')
                console.log('Sucess: ', response.data)
            }
            catch(error) {
                console.error("Error getting user data")
            }
        }
        fetchProtectedData()
    }, [])
    return (
    <>
        <p className='text-light container'>Dashboard</p>
    </>
    )
}