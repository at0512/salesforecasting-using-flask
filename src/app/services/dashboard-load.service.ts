import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UploadObject } from '../upload/upload.component';

@Injectable({
  providedIn: 'root',
})
export class DashboardLoadService {
  isUploaded = false;
  response: any;
  error: any;
  coordsSales: any;
  coordsPredicted: any;
  errorMetrics: any;
  AIC: any;
  monthlyAvg: any;
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  processCoords(
    timeList: any,
    coords: any,
    startIndex: number,
    endIndex: number,
    inc: any
  ) {
    let resp = [];
    for (let i = startIndex; i < endIndex; i++) {
      let coord = {
        x: timeList[inc + i],
        y: coords[i],
      };
      resp.push(coord);
    }
    return resp;
  }
  setResponse(response: any, coordsSales: any, coordsPredicted: any) {
    this.response = response;
    this.AIC = response["AIC"];
    this.errorMetrics = response["errorMetrics"];
    this.monthlyAvg = response['monthlyAvg']
    this.coordsSales = coordsSales;
    this.coordsPredicted = coordsPredicted;
    console.log(this.response);
  }

  getTimeList() {
    return this.response['timeList'];
  }
  getcoordsSales() {
    return this.coordsSales;
  }
  getcoordsPredicted() {
    return this.coordsPredicted;
  }
  geterrorMetrics() {
    return this.errorMetrics;
  }
  getAIC() {
    return this.AIC;
  }
  getMonthlyAvg() {
    return this.monthlyAvg;
  }

  uploadFile(file: any, url: string) {
    this.isUploaded = true;
    return this.http.post<UploadObject>(url, file);
  }
}
