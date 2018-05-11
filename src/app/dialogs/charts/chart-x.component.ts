import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
 selector: 'line-chart-demo',
 templateUrl: './chart-x.component.html'
})
export class LineChartDemoComponent {

  @Input() public data: Array<any>;  // array data
  @Input() public labels: Array<any>;  // array data
  @Input() public type: string;  // array data
  public lineChartData:Array<any>;
  public lineChartLabels:Array<any>;
  public lineChartType:string = 'line';

  ngOnChanges(changes: SimpleChanges) {
      if(this.data.length > 0) {
        this.lineChartData = this.data;
        this.lineChartLabels = this.labels;
      }
      if(changes.type){
        this.lineChartType = this.type;
      }
  }

 public lineChartOptions:any = {
   responsive: true
 };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend:boolean = true;

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
}