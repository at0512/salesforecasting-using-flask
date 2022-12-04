from cmath import nan
import itertools
from math import sqrt
from time import time_ns
import numpy as np
import pandas as pd

import matplotlib.pyplot as plt

from statsmodels.tsa.stattools import adfuller
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import statsmodels.api as sm
from sklearn.metrics import mean_squared_error, r2_score

from pandas.tseries.offsets import DateOffset

def calculate_mape(actual, predicted) -> float:
    
        # Convert actual and predicted
        # to numpy array data type if not already
        if not all([isinstance(actual, np.ndarray),
                    isinstance(predicted, np.ndarray)]):
            
            actual, predicted = np.array(actual), np.array(predicted)
            print("done")
        # Calculate the MAPE value and return
        return round(np.mean(np.abs((actual - predicted) / actual)*10), 4)

def arima(df):
    # Cleaning up the data
    df.columns = ["Month", "Sales"]

    df.drop(106, axis=0, inplace=True)
    df.drop(105, axis=0, inplace=True)
    # Convert Month into Datetime 

    df['Month'] = pd.to_datetime(df['Month'])

    df.set_index('Month', inplace=True)

    # Testing For Stationarity
    test_result = adfuller(df['Sales']) 
    resp = {}

    # stationarity Hypothesis

    # Ho: It is non stationary
    #H1: It is stationary

    def adfuller_test(sales):
        result = adfuller(sales)
        labels = ['ADF Test Statistic', 'p-value',
                  '#Lags Used', 'Number of Observations Used']
        for value, label in zip(result, labels):
            print(label+' : '+str(value))
        if result[1] <= 0.05:
            print("strong evidence against the null hypothesis(Ho), reject the null hypothesis. Data has no unit root and is stationary")
        else:
            print("weak evidence against null hypothesis, time series has a unit root, indicating it is non-stationary ")

    adfuller_test(df['Sales'])
    df['Sales First Difference'] = df['Sales'] - df['Sales'].shift(1)
    df['Sales'].shift(1)
    df['Seasonal First Difference'] = df['Sales']-df['Sales'].shift(12)

    # Again test dickey fuller test
    adfuller_test(df['Seasonal First Difference'].dropna())

    # ARIMA models are denoted by ARIMA(p, d, q).
    # p, d, and q represent seasonality, trend, and noise in data respectively
    # Define the p, d and q parameters to take any value between 0 and 3
    p = d = q = range(0, 2)
    # Generate all different combinations of p, q and q triplets
    pdq = list(itertools.product(p, d, q))
    # Generate all different combinations of seasonal p, q and q triplets
    seasonal_pdq = [(x[0], x[1], x[2], 12)
                    for x in list(itertools.product(p, d, q))]
    print('Examples of parameter combinations for Seasonal ARIMA: ')
    print('SARIMAX: {} x {}'.format(pdq[1], seasonal_pdq[1]))
    print('SARIMAX: {} x {}'.format(pdq[1], seasonal_pdq[2]))
    print('SARIMAX: {} x {}'.format(pdq[2], seasonal_pdq[3]))
    print('SARIMAX: {} x {}'.format(pdq[2], seasonal_pdq[4]))

    # Determing p,d,q combinations with AIC scores.
    AIC_scores = {
        "param": [],
        "param_seasonal": [],
        "result": []
    }
    for param in pdq:
        for param_seasonal in seasonal_pdq:
            try:
                mod = sm.tsa.statespace.SARIMAX(df["Sales"],
                                                order=param,
                                                seasonal_order=param_seasonal,
                                                enforce_stationarity=False,
                                                enforce_invertibility=False)
                results = mod.fit(disp=0)
                print('ARIMA{}x{}12 - AIC:{}'.format(param, param_seasonal, results.aic))
                # print(param_seasonal)
                AIC_scores["param"].append(str(param))
                AIC_scores["param_seasonal"].append(str(param_seasonal))
                AIC_scores["result"].append(str(results.aic))
            except:
                pass

    # ARIMA(1, 1, 1)x(1, 1, 1, 12)12 - AIC:1265.1232995136045

    print(AIC_scores)


    model = sm.tsa.statespace.SARIMAX(
        df['Sales'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    results = model.fit()
    print(results.summary().tables[1])
    

    df['forecast'] = results.predict(start=90, end=103, dynamic=True)

    a = list(df["Sales"])[-14:-1]
    f = list(df["forecast"].dropna())[1:]
    mape = calculate_mape(a, f)
    print("mape :", mape, "%")
    print("accuracy:", 100-mape)
    rms = sqrt(mean_squared_error(list(df["Sales"])[
               90:104], list(df["forecast"])[-15:-1]))
    print('Root Mean Square', str(rms))


    future_dates = [df.index[-1] + DateOffset(months=x)for x in range(0, 24)]

    future_datest_df = pd.DataFrame(index=future_dates[1:], columns=df.columns)
    future_df = pd.concat([df, future_datest_df])
    #  104 120
    future_df['forecast'] = results.predict(start=104, end=120, dynamic=True)

    timeList = []

    for i in list(future_df.index):
        if (str(i).split()[0]) not in timeList:
            timeList.append(str(i).split()[0])
    forecast = list(future_df['forecast'].dropna())
    sales = list(future_df['Sales'].dropna())
    resp = {
        "ErrorMetrics": [str(rms)[:6], str(100-mape)[:5]],
        "AIC": AIC_scores,
        "timeList": timeList,
        "sales": sales,
        "forecast": forecast
    }
    return resp
     # writing it into a csv
    t = [i for i in timeList[:-6]]
    s = [i for i in sales]
    sd = [i for i in sales]
    f = [i for i in forecast]
    for i in f:
        s.append(0)
    for i in sd[::-1]:
        f.insert(0, 0)
    print(len(t), len(s), len(f))
    data = []
    for i in range(len(t)):
        d = {}
        d['date'] = t[i]
        d['sales'] = s[i]
        d['forecast'] = f[i]
        data.append(d)

    bi = pd.DataFrame(data)
    # bi.set_index('date',inplace=True)
    # print(bi)
    bi.to_csv('raw_data.csv', index=False)


    # future_df[['Sales', 'forecast']].plot(figsize=(12, 8))
