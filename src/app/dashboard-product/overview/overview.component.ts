import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { single, multi, multi2 } from './data';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDigitsPipe } from '@covalent/core/common';

import { UserService, IUser } from '../../users';

import { ItemsService } from '../../../services';

import { Chart } from 'chart.js'; // andrew
//import { ViewChild, ElementRef } from '@angular/core'; // andrew

@Component({
  selector: 'ce-product-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  viewProviders: [ ItemsService ],
})
export class ProductOverviewComponent implements OnInit {

  items: Object[];
  users: IUser[];

  // Chart
  single: any[];
  multi: any[];
  multi2: any[];

  // Generic Chart options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  autoScale: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'X Axis';
  yAxisLabel: string = 'Y Axis';

  orangeColorScheme: any = {
    domain: [
      '#E64A19', '#F57C00', '#FFA726', '#FFB74D', '#FFCC80',
    ],
  };

  blueColorScheme: any = {
    domain: [
      '#01579B', '#00B0FF', '#80D8FF', '#E1F5FE',
    ],
  };

  // andrew begin
  //@ViewChild('ingestcanvas') ingestCanvas: ElementRef;
  //chart:Chart;
  /*chartMonths:any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  chartConfig:any = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
      datasets: [{
        label: 'My First dataset',
        backgroundColor: '#cc3333',
        borderColor: '#cc3333',
        data: [86,114,106,106,107,111,133,221,783,2478],
        fill: false,
      }, {
        label: 'My Second dataset',
        fill: false,
        backgroundColor: '#0066ff',
        borderColor: '#0066ff',
        data: [282,350,411,502,635,809,947,1402,3700,5267],
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      }
    }
  };
  */
    // ng4-charts:

    // lineChart
    public lineChartData:Array<any> = [
      {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
      {data: [31, 27, 62, 35, 44, 19, 64], label: 'Series C'},
      {data: [27, 50, 74, 16, 85, 30, 71], label: 'Series D'},
      {data: [20, 35, 30, 15, 45, 15, 40], label: 'StdDevMin', fill: 5, pointStyle: 'line', borderWidth: 0.15},
      {data: [100, 75, 100, 45, 105, 50, 100], label: 'StdDevMax', fill: false, pointStyle: 'line', borderWidth: 0.15}
    ];
    public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    // andrew: note: If responsive: true and maintainAspectRatio: false settings are set, you can then set the css height property of the <base-chart> element.
    public lineChartOptions:any = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 1,
          fill: false
        },
        point: {
          pointStyle: 'circle',
          radius: 0,
          hitRadius: 0,
          hoverRadius: 0,
          hoverBorderWidth: 0
        },
      },
      legend: {
        display: true,
        labels: {
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
          filter: (legendItem, chartData) => {
            // return true or false based on legendItem's datasetIndex (legendItem.datasetIndex)
            // Hide standard deviation labels (index 4 and 5)
            return (legendItem.datasetIndex <= 3);
          }
        }
      },
      tooltips: {
        enabled: false
      }
    };
    public lineChartColors:Array<any> = [
      { // red
        //backgroundColor: 'rgba(148,159,177,0.2)', // gray
        //borderColor: 'rgba(148,159,177,1)', // gray
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: 'rgba(220, 53, 69, 1)',
        //pointBackgroundColor: 'rgba(148,159,177,1)', // gray
        pointBackgroundColor: 'rgba(220, 53, 69, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        //pointHoverBorderColor: 'rgba(148,159,177,0.8)' // gray
        pointHoverBorderColor: 'rgba(220, 53, 69, 1)'
      },
      { // blue
        //backgroundColor: 'rgba(77,83,96,0.2)',// dark grey
        //borderColor: 'rgba(77,83,96,1)',// dark grey
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 1)',
        //pointBackgroundColor: 'rgba(77,83,96,1)',// dark grey
        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        //pointHoverBorderColor: 'rgba(77,83,96,1)'// dark grey
        pointHoverBorderColor: 'rgba(0, 123, 255, 1)'
      },
      { // green
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderColor: 'rgba(40, 167, 69, 1)',
        pointBackgroundColor: 'rgba(40, 167, 69, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(40, 167, 69, 1)',
      },
      { // orange
        backgroundColor: 'rgba(218, 126, 0, 0.2)',
        borderColor: 'rgba(218, 126, 0, 1)',
        pointBackgroundColor: 'rgba(218, 126, 0, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(218, 126, 0, 1)',
      },
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';
  // andrew end

  constructor(private _titleService: Title,
              private _itemsService: ItemsService,
              private _userService: UserService,
              private _loadingService: TdLoadingService) {
    // Chart Single
    Object.assign(this, {single});
    // Chart Multi
    this.multi = multi.map((group: any) => {
      group.series = group.series.map((dataItem: any) => {
        dataItem.name = new Date(dataItem.name);
        return dataItem;
      });
      return group;
    });
    // Chart Multi2
    this.multi2 = multi2.map((group: any) => {
      group.series = group.series.map((dataItem: any) => {
        dataItem.name = new Date(dataItem.name);
        return dataItem;
      });
      return group;
    });
  }

  ngOnInit(): void {
    this._titleService.setTitle( 'Product Name' );

    // andrew begin
    //let ctx = this.ingestCanvas.nativeElement.getContext('2d');
    //this.chart = new Chart(ctx, this.chartConfig);

    //console.log(this.canvas.nativeElement.innerHTML);
    //let htmlRef = this.elementRef.nativeElement.querySelector(`#yourCavasId`);
    //this.chart = new Chart('canvas', this.chartConfig);
    //this.chart = new Chart(this.canvas, this.chartConfig);
    // andrew end

    this._loadingService.register('items.load');
    this._itemsService.query().subscribe((items: Object[]) => {
      this.items = items;
      setTimeout(() => {
        this._loadingService.resolve('items.load');
      }, 2000);
    }, (error: Error) => {
      this._itemsService.staticQuery().subscribe((items: Object[]) => {
        this.items = items;
        setTimeout(() => {
          this._loadingService.resolve('items.load');
        }, 2000);
      });
    });
    this._loadingService.register('users.load');
    this._userService.query().subscribe((users: IUser[]) => {
      this.users = users;
      setTimeout(() => {
        this._loadingService.resolve('users.load');
      }, 2000);
    }, (error: Error) => {
      this._userService.staticQuery().subscribe((users: IUser[]) => {
        this.users = users;
        setTimeout(() => {
          this._loadingService.resolve('users.load');
        }, 2000);
      });
    });
  }

  // andrew begin
  //ngAfterViewInit() {
    //console.log(this.canvas.nativeElement.innerHTML);
    //this.chart = new Chart('canvas', this.chartConfig);
  //}
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }
   
    public chartHovered(e:any):void {
      console.log(e);
    }
  // andrew end

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }
}
