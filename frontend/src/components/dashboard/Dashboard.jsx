import { useEffect, useState } from "react"
import axios from "axios"
import axiosInstance from "../../axiosInstance"
import { TailSpin } from 'react-loading-icons'
export default function Dashboard({children}) {
    const [ticker, setTicker] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [plot, setPlot] = useState()
    const [predPlot, setPredPlot] = useState()
    const [ma100Plot, setMA100Plot] = useState()
    const [ma30Plot, setMA30Plot] = useState()
    const [mse, setMSE] = useState()
    const [rmse, setRMSE] = useState()
    const [r2_score, setR2] = useState()
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    useEffect(() => {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstance.get('/protected-view/')
            }
            catch(error) {
                console.error("Error getting user data")
            }
        }
        fetchProtectedData()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await axiosInstance.post('/prediction/', {
                ticker: ticker
            });
            //console.log("Ticker Response:", response)
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT
            const plotUrl = `${backendRoot}${response.data.plot_img}`
            const predPlotUrl = `${backendRoot}${response.data.plot_prediction}`
            const moving100_url = `${backendRoot}${response.data.plot_100days_ma}`
            const moving30_url = `${backendRoot}${response.data.plot_30days_ma}`
            setPlot(plotUrl)
            setPredPlot(predPlotUrl)
            setMA100Plot(moving100_url)
            setMA30Plot(moving30_url)
            setMSE(response.data.mse)
            setRMSE(response.data.rmse)
            setR2(response.data.r2)
            if (response.data.status === "error") {
                setError(response.data.error); 
                console.error("Error:", response.data.error);
            } else {
                //console.log("Ticker Response:", response.data);
                setError(null);
            }
        }catch(error) {
            console.error("There was an error making the API request", error)
        } finally {
            setLoading(false)
        }
    }
    return (
    <>
        <div className='container'>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <input type="text" className='form-control' placeholder='Enter the Stock Ticker'
                        onChange={(e) => setTicker(e.target.value)} required
                        />
                        {error &&  <small><div className = "text-danger text-center mb-3">{error}</div></small>}
                        <div className="d-flex justify-content-center mt-3">
                            {loading ? ( 
                                <div className="alert alert-primary" style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                                    <TailSpin height="2em" width="2em" />
                                    <p style={{ marginBottom: 0 }}>Please Wait...</p> 
                                </div>
                                ) : (
                                <button type='submit' className='btn btn-info'>See Stock Prediction</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Prints the plots */}
                <div className="prediction mt-5">
                    <div className="p-5">
                        {plot && (
                            <img src={plot} style={{maxWidth: "100%"}}/>
                        )}
                    </div>
                     <div className="p-5">
                        {ma100Plot && (
                            <img src={ma100Plot} style={{maxWidth: "100%"}}/>
                        )}
                    </div>
                    <div className="p-5">
                        {ma30Plot && (
                            <img src={ma30Plot} style={{maxWidth: "100%"}}/>
                        )}
                    </div>
                    <div className="p-5">
                        {predPlot && (
                            <img src={predPlot} style={{maxWidth: "100%"}}/>
                        )}
                    </div>
                    <div className="text-light p-5">
                        <h4>Model Evaluation</h4>
                        <p>Mean Squared Error: {mse}</p>
                        <p>Root Mean Squared Error: {rmse}</p>
                        <p>R-Squared (Accuracy): {r2_score}</p>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}