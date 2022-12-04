import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DashboardLoadService } from '../services/dashboard-load.service';

const API = 'http://localhost:5000/api/';
export interface UploadObject {
  statusCode: string;
  monthlyAvg: any;
  errorMetrics: any;
  AIC: any;
  timeList: any;
  sales: any;
  forecast: any;
  mail: any;
  error: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass'],
})
export class UploadComponent implements OnInit {
  @ViewChild('fileSelect') myInputVariable?: ElementRef;

  formFile: any;
  error: string = "";
  response: any;
  enableSubmit = false;
  isUploaded = false;
  isloading = false;
  uploadForm!: FormGroup;
  constructor(
    private router: Router,
    private http: HttpClient,
    private dashboardLoadService: DashboardLoadService
  ) {


  }

  ngOnInit(): void {
    this.verifyToken();
    this.uploadForm = new FormGroup({
      file: new FormControl(null, [
        Validators.required
      ]),
    });
  }

  get file() {
    return this.uploadForm.get('file')!;
  }
  onFileSelect(event: any) {
    if (event.target.files[0]) {
          this.formFile = new FormData();
          this.formFile.append('file', event.target.files[0]);
    }

  }


  onSubmit() {
    this.isloading = true;
    let url = API + 'upload-file';
    this.dashboardLoadService.uploadFile(this.formFile, url).subscribe({
      next: (data: UploadObject) => {
        this.isloading = false;
        this.response = { ...data };
        console.log(this.response);
        if (this.response['statusCode'] === "400"){
          this.error = "Something Went Wrong, make sure you have uploaded the correct file!"
        }
        else {
          this.isUploaded = true;
          let dataSales = this.dashboardLoadService.processCoords(this.response["timeList"], this.response["sales"], 0, this.response["sales"].length, 0);
          let dataPredicted = this.dashboardLoadService.processCoords(this.response["timeList"], this.response["forecast"], 0, this.response["forecast"].length, this.response["sales"].length);
          this.dashboardLoadService.setResponse(this.response, dataSales, dataPredicted);
          this.router.navigate([`/dashboard`]);
        }




      },
      error: (error) => (this.error = error), // error path
    });

    console.log(this.response)

  }
 


  verifyToken() {
    let url = API + 'upload-file';
    return this.http.get<UploadObject>(url).subscribe({
      next: (data: UploadObject) => {
        this.response = { ...data };
        console.log(this.response);

      },
      error: (error) => (this.error = error), // error path
    });
  }
}

