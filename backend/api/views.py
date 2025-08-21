from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer
from rest_framework import status
from rest_framework.response import Response

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import yfinance as yf
from datetime import datetime
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score
import os
from django.conf import settings
class StockPredictionView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            # Fetch the data from yfinance
            now = datetime.now()
            start = datetime(now.year-10, now.month, now.day)
            ticker = ticker.strip().upper()
            end = now
            df = yf.download(ticker, start, end, auto_adjust=True, group_by='column')
            if df.empty:
                return Response({"error": "No data found for the given ticker", "status": "error", "status_code": status.HTTP_404_NOT_FOUND})
            df.columns = [col[0] for col in df.columns]
            df.reset_index(inplace=True)

            # Generate a basic plot
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df['Close'])
            plt.title(f"Closing Price of {ticker}")
            plt.xlabel('Number of Days')
            plt.ylabel("Closing Price")
           # plt.legend()

            # Save the plot to a file
            plot_img_path = f'{ticker}_plot.png'
            image_path = os.path.join(settings.MEDIA_ROOT, plot_img_path)
            plt.savefig(image_path)
            plt.close()
            plot_img = settings.MEDIA_URL + plot_img_path

            # 100-day MVA
            df['MA_100'] = df['Close'].rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df['Close'], label="Closing Price")
            plt.plot(df['MA_100'], 'r', label='100 Day Moving Average')
            plt.title(f"Closing Price vs 100-Day Moving Average of {ticker}")
            plt.xlabel('Number of Days')
            plt.ylabel("Price")
            plt.legend()
            
            moving100_img_path = f'{ticker}_100days_ma_plot.png'
            plot_100days_ma = save_plot(moving100_img_path)

            # 30-day MVA
            df['MA_30'] = df['Close'].rolling(30).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df['Close'], label="Closing Price")
            plt.plot(df['MA_30'], 'r', label='30 Day Moving Average')
            plt.title(f"Closing Price vs 30-Day Moving Average of {ticker}")
            plt.xlabel('Number of Days')
            plt.ylabel("Price")
            plt.legend()
            
            moving30_img_path = f'{ticker}_30days_ma_plot.png'
            plot_30days_ma = save_plot(moving30_img_path)

            # Volatility
            df['Return'] = df['Close'] / df['Close'].shift(1) - 1
            df['Vol_20d'] = df['Return'].rolling(20).std()
            df['Vol_60d'] = df['Return'].rolling(60).std()
            #Make testing df
            test_df = df[['Open', 'MA_30', 'MA_100', 'Vol_20d', 'Vol_60d', 'Close']]
            test_df = test_df.dropna()
            # Make the Prediction
            data_train = pd.DataFrame(test_df[:int(len(df) * 0.7)])
            data_test = pd.DataFrame(test_df[int(len(df) * 0.7):])
            # Scaler for data
            minScaler = MinMaxScaler(feature_range=(-1,1))
            yScaler = MinMaxScaler(feature_range=(-1,1))
            # Model
            model = load_model('../Resources/stock_prediction_model.keras')

            # Input data
            past_100 = data_train[['Open', 'MA_30', 'MA_100', 'Vol_20d', 'Vol_60d']].tail(100)
            final_df = pd.concat([past_100, data_test[['Open', 'MA_30', 'MA_100', 'Vol_20d', 'Vol_60d']]], ignore_index=True)
            data_scaled = minScaler.fit_transform(final_df)

            past_100 = data_train['Close'].tail(100)
            y_df = pd.concat([past_100, data_test['Close']], ignore_index=True)
            y_scaled = yScaler.fit_transform(y_df.to_frame())

            X_test = []
            y_test = []
            days_out = 1
            k = days_out - 1

            #start with 1 day out. k will take days_out and automatically change it. Never do days_out < 1.
            for i in range(100+k, len(data_scaled)):
                X_test.append(data_scaled[i-100-k:i-k])
                y_test.append(y_scaled[i, 0])
            X_test, y_test = np.array(X_test), np.array(y_test)

            y_predicted = model.predict(X_test)
            
            # Inverse transform the data
            y_predicted = yScaler.inverse_transform(y_predicted.reshape(-1, 1)).flatten()
            y_test = yScaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

            # Prediction Plot
            plt.figure(figsize=(12,6))
            plt.plot(y_test, 'blue', label='Test Prices')
            plt.plot(y_predicted, 'red', label='Predicted Prices')
            plt.xlabel('Days')
            plt.ylabel('Price in $')
            plt.title("Stock Price Predictions")
            plt.legend()

            prediction_img_path = f'{ticker}_prediction_plot.png'
            plot_prediction = save_plot(prediction_img_path)

            # Model Evaluation Data
            mse = mean_squared_error(y_test, y_predicted)
            rmse = np.sqrt(mse)
            r2 = r2_score(y_test, y_predicted)
            return Response({'status': 'success', 
                             'plot_img': plot_img,
                             'plot_100days_ma': plot_100days_ma,
                             'plot_30days_ma': plot_30days_ma,
                             'plot_prediction': plot_prediction,
                             'mse': mse,
                             'rmse': rmse,
                             'r2': r2,
                             })

        return Response({"error": "Invalid ticker", "status": "error", "status_code": status.HTTP_400_BAD_REQUEST})
