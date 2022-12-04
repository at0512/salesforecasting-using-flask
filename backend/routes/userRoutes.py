from flask import Flask
from flask import jsonify, request, make_response, current_app

import pandas as pd
from ML.arima import arima
from Utils.avgCalculator import avg



def api_routes(endpoints):
    
    @endpoints.route('/upload-file', methods=['GET', 'POST'])
    def upload_file():
        resp={}
        try:
            # Acknowledging authorization back to the server
            if request.method == 'GET':
                resp['statusCode'] = "200"
                resp['monthlyAvg'] = []
                resp["errorMetrics"] = []
                resp["AIC"] = []
                resp['timeList'] = []
                resp['sales'] = []
                resp['forecast'] = []  
                resp['error'] = "" 
                return resp 
            
            req = request.form
            file = request.files.get('file')
            df = pd.read_csv(file)


            if(len(df.columns) != 2):
                raise Exception("Make sure you have uploaded the correct file!")

            coords = arima(df)

            errorMetrics = list(coords['ErrorMetrics'])
            AIC = coords['AIC']
            sales = list(coords['sales'])
            forecast = list(coords['forecast'])
            timeList = list(coords['timeList'])

            monthlyAvg = avg(timeList, sales)
            
            
            resp['statusCode'] = "200"
            resp['monthlyAvg'] = monthlyAvg
            resp['errorMetrics'] = errorMetrics
            resp['AIC'] = AIC
            resp['timeList'] = timeList
            resp['sales'] = sales
            resp['forecast'] = forecast
            resp['error'] = ""   
            print (resp)
            return resp

        except Exception as e:
            print(e)
            resp['statusCode'] = "400"
            resp['monthlyAvg'] = []
            resp["errorMetrics"] = []
            resp["AIC"] = []
            resp['timeList'] = []
            resp['sales'] = []
            resp['forecast'] = []
            resp['error'] = str(e) 
        print(resp)
        return resp
    return endpoints
