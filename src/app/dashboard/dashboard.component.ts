import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  registerables,
  Chart
} from 'node_modules/chart.js';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { DashboardLoadService } from '../services/dashboard-load.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [

        query(':leave', [
          stagger(500, [
            animate(100, style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(500, [
            animate(1000, style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardLoadService: DashboardLoadService) {
    Chart.register(...registerables);
  }

  viewM1: boolean = true;
  m1: string = "Choosing the best P, D, Q paramter for your data...";

  viewM2: boolean = false;
  m2: string = " Best Parameters Found: ARIMA(1, 1, 1)x(1, 1, 1, 12) - AIC:1265.1232995136045";

  viewM3: boolean = false;
  m3: string = "Training the Model...";

  viewM4: boolean = false;
  m4: string = "Generating Dashboard for your data..."

  viewParams: boolean = false;
  viewCharts: boolean = false;
  displayAlert: boolean = true;
  monthlyAvg: any;
  timeList: any;
  dataSales: any;
  dataPredicted: any;
  AIC: any = {
    "param": [],
    "param_seasonal": [],
    "result": []
  };
  errorMetrics: any;

  accuracyCount: number = 0
  rmseCount: number = 0

  displaypdq(val: boolean){
    this.viewM1 = val;
    this.viewParams = val;
  }

  displaym2(val: boolean){
    this.viewM2 = val
  }
  displaym3(val: boolean){
    this.viewM3 = val
  }
  displaym4(val: boolean){
    this.viewM4 = val
  }
  

  ngOnInit(): void {
    this.timeList = this.dashboardLoadService.getTimeList()
    this.dataSales = this.dashboardLoadService.getcoordsSales();
    this.dataPredicted = this.dashboardLoadService.getcoordsPredicted();
    this.AIC = this.dashboardLoadService.getAIC();
    this.errorMetrics = this.dashboardLoadService.geterrorMetrics();
    this.monthlyAvg = this.dashboardLoadService.getMonthlyAvg();

    this.displaypdq(true);

    setTimeout(()=>{
      this.displaypdq(false);
      this.displaym2(true);
    }, 2000);

    setTimeout(()=>{
      this.displaym2(false);
      this.displaym3(true)
    }, 4000);

    setTimeout(()=>{
      this.displaym3(false);
      this.displaym4(true);
      this.viewCharts = true;
      let accuracyCountStop = setInterval(()=>{
        if(this.accuracyCount < Number(this.errorMetrics[1]))
        this.accuracyCount += 1;
        if(this.accuracyCount > Number(this.errorMetrics[1])) clearInterval(accuracyCountStop);
      })
      let rmseCountStop = setInterval(()=>{
        this.rmseCount++;
        if(this.rmseCount > Number(this.errorMetrics[0])) clearInterval(rmseCountStop);
      })
    }, 8000);

    setTimeout(()=>{
      this.displaym4(false);
      this.displayAlert = false;
      
      const myChart1 = new Chart("myChart1", {
        type: 'line',
        data: {
          labels: this.timeList,
          datasets: [{
            label: 'Orignal Sales',
            data: this.dataSales,
            tension: 0.3,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
  
          },
          {
            label: 'Predicted Sales',
            data: this.dataPredicted,
            tension: 0.3,
            borderColor: 'rgb(255,215,0)',
            backgroundColor: 'rgb(255,215,0)',
  
          }
          ]
        },
        options: {
          responsive: true,
          scales: {}
        }
      });
      const myChart2 = new Chart("myChart2", {
        type: 'doughnut',
        data: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          datasets: [{
            label: 'Monthly Avg',
            data: this.monthlyAvg,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(46, 13, 211)',
              'rgb(122,148,122)',
              'rgb(211,122,220)',
              'rgb(236,50,8)',
              'rgb(70,217,220)',
              'rgb(249,37,171)',
              'rgb(37, 40, 80)',
              'rgb(120, 133, 139)',
              'rgb(63, 136, 143)',
  
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          scales: {}
        }
      });
  
      const myChart3 = new Chart("myChart3", {
        type: 'scatter',
        data: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          datasets: [{
            type: "bar",
            label: 'Monthly Sales figures',
            data: this.monthlyAvg,
            borderColor: 'rgb(120, 133, 139)',
            backgroundColor: 'rgb(120, 133, 139)',
          }, {
            type: "line",
            label: 'Monthly Sales Trend',
            data: this.monthlyAvg,
            backgroundColor: 'rgb(37, 40, 80)',
            borderColor: 'rgb(37, 40, 80)',
          }]
        },
        options: {
          responsive: true,
          scales: {}
        }
      });
    }, 10000);

    
  }


}
