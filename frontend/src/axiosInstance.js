import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL_BASE
// Base Instance
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})
// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config) {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    function (error) {
        return Promise.reject(error);
    }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
    function(response) {
        return response;
    },
    // error function
    async function (error) {
        const ogRequest = error.config;
        if (error.response.status === 401 && !ogRequest.retry) {
            ogRequest.retry = true
            const refreshToken = localStorage.getItem('refreshToken')

            try {
                const response = await axiosInstance.post('/token/refresh/', {refresh: refreshToken})
                localStorage.setItem('accessToken', response.data.access)
                ogRequest.headers['Authorization'] = `Bearer ${response.data.access}`
                return axiosInstance(ogRequest)
            } catch(error) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
            }
        }
        return Promise.reject(error);
    }

)

export default axiosInstance;