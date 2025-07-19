import React from 'react' 

export default function Header() {
    return (
    <>
        <div className='container'>
            <div className='p-5 text-center home-info'>
                <h1 className='title-text'>Stock Prediction Portal</h1>
                <p className='body-text'>A full-stack stock prediction web application built with Django on the backend and Keras with TensorFlow for machine learning. 
                    The system employs a Long Short-Term Memory (LSTM) model trained on historical stock data, leveraging
                     100-day and 200-day moving averages to forecast future stock prices. This predictive insight is designed to support 
                     informed trading and investment decisions.
                </p>
                <a className="btn btn-primary" href="">Login</a>
            </div>
        </div>
    </>
    )
}