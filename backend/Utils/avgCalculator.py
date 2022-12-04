


from calendar import month
from time import time


def avg(timeList, sales):

    s = {
        "January": [],
        "February": [],
        "March": [],
        "April": [],
        "May": [],
        "June": [],
        "July": [],
        "August": [],
        "September": [],
        "October": [],
        "November": [],
        "December": [],

    }

    
    for i in range(len(sales)):
        m = int(timeList[i][5:7])
        if(m == 1):
            s["January"].append(sales[i])
            
            
        if(m == 2):
            s["February"].append(sales[i])
            
        
        if(m == 3):
            s["March"].append(sales[i])
    

        if(m == 4):
            s["April"].append(sales[i])
    

        if(m == 5):
            s["May"].append(sales[i])

        if(m == 6):
            s["June"].append(sales[i])


        if(m == 7):
            s["July"].append(sales[i])


        if(m == 8):
            s["August"].append(sales[i])
        

        if(m == 9):
            s["September"].append(sales[i])
            

        if(m == 10):
            s["October"].append(sales[i])
            

        if(m == 11):
            s["November"].append(sales[i])
        

        if(m == 12):
            s["December"].append(sales[i])
            
        
    avg = []   
    for i in list(s.keys()):
        avg.append(sum(s[i])/len(s[i]))
    
    return avg
    