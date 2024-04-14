import {Title} from "@angular/platform-browser";

import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit } from '@angular/core';
import { CommonModule,DOCUMENT } from '@angular/common';
import Chart from 'chart.js/auto'
import { NavigationEnd, Route, Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from "rxjs";
import { Renderer2 } from '@angular/core';
import { Transaction } from "../../shared/models/transaction.model";
import { TransactionService } from "../../shared/services/transaction.service";
import { CalendarModule, CalendarTypeView } from 'primeng/calendar';
import { Category } from "../../shared/models/category.model";
import { CategoryService } from "../../shared/services/category.service";
import { AccountService } from "../../shared/services/account.service";


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CalendarModule],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  title = 'Home';

  transactions : Transaction[] = []

  usedTransactions : Transaction[] = []

  categories : Category[] = []

  usedCategories : Category[] = []

  init : boolean = false

  total: number = 0

  spendlessTitle = this.document.querySelector("#spendlessTitle") as HTMLElement

  canvasDiv = this.document.querySelector("#canvasDiv") as HTMLElement

  canvasDiv2 = this.document.querySelector("#canvasDiv2") as HTMLElement

  canvasDiv3 = this.document.querySelector("#canvasDiv3") as HTMLElement

  selected: any

  usedDate: string = new Date().getDate().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getFullYear().toString()

  calendarHere: boolean = false

  calendarView: CalendarTypeView = "date"

  animdone: boolean = localStorage.getItem("anim?") == "Oui"





  constructor(private titleService: Title,@Inject(DOCUMENT) private document: Document, private router: Router, private accountService: AccountService,
  private transactionService: TransactionService, private _renderer: Renderer2, private categoriesService: CategoryService) {
    this.titleService.setTitle(this.title);
    console.log("tets")
    this.router.events
    .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    .subscribe((events: RoutesRecognized[]) => {
    });
  }


  ngOnInit() {
    console.log(this.init)
    this.total = 0
    this.spendlessTitle = this.document.querySelector("#spendlessTitle") as HTMLElement
    this.canvasDiv = this.document.querySelector("#canvasDiv") as HTMLElement
    this.canvasDiv2 = this.document.querySelector("#canvasDiv2") as HTMLElement
    this.canvasDiv3 = this.document.querySelector("#canvasDiv3") as HTMLElement
    this._renderer.setStyle(document.body, 'overflow', 'hidden');

    window.addEventListener('unload', (event) => {
      localStorage.setItem("anim?", "Non");
    });

    window.addEventListener('resize', (event) => {
      this.createChart()
    });

    console.log(this.usedDate)
    

    this.selected = this.document.querySelector("#dayClick") as HTMLElement

    let token = this.accountService.getToken();
    this.categoriesService.getCategoriesFromUser(token).then(data => {
      this.categories = data
      console.log(this.categories)

      let token = this.accountService.getToken();
      this.transactionService.getTransactionsFromId(token).then(data => {
        this.transactions = data
        this.init = true
        console.log(this.transactions)

        if(localStorage.getItem("anim?") != "Oui"){
          this.appear()
        }
        else{
          this.spendlessTitle = this.document.querySelector("#spendlessTitle") as HTMLElement
          let timeDiv = this.document.querySelector("#time") as HTMLElement
          timeDiv.style.marginTop = "80px"
          this.spendlessTitle.style.display = "none"
          this.canvasDiv.style.opacity = "1"
          this.canvasDiv2.style.opacity = "1"
          this.canvasDiv3.style.opacity = "1"
          this._renderer.removeStyle(document.body, 'overflow');
          let whole = this.document.querySelector("#whole") as HTMLElement
          whole.style.height = ""
          whole.style.overflowY= "auto"

        }

        this.createChart()
    })
  })
}

  appear(){
    let whole = this.document.querySelector("#whole") as HTMLElement
    localStorage.setItem("anim?", "Oui");
    console.log(this.spendlessTitle)
    this.spendlessTitle = this.document.querySelector("#spendlessTitle") as HTMLElement
    if(this.spendlessTitle){
      let h1Title = this.spendlessTitle.getElementsByTagName("h1")[0]

      window.setTimeout(() => {
        h1Title.style.opacity = "1"
        h1Title.style.top = "0"

        window.setTimeout(() => {

          if(this.spendlessTitle){
            let h1Title = this.spendlessTitle.getElementsByTagName("h1")[0]
      
            console.log(this.spendlessTitle)
            h1Title.style.fontSize = "2.5rem"
            this.spendlessTitle.style.height = "10vh"
            this.spendlessTitle.style.zIndex = "0"
            whole.style.height = ""
            whole.style.overflowY = "auto"
          }
          window.setTimeout(() => {
            this.canvasDiv.style.opacity = "1"
            this.canvasDiv2.style.opacity = "1"
            this.canvasDiv3.style.opacity = "1"
            this._renderer.removeStyle(document.body, 'overflow');

          }, 500);
          
        }, 1000);

      }, 500);
      
    }

  }

  selecTime(event: Event){
    console.log(event ? event.target : "bruh")

    if(this.selected != null){
      this.selected.classList.remove("selectBG")
      this.selected = event.target
      let newDate = new Date()
      if(this.selected.innerHTML == "Week"){
        let nextDate = new Date()
        nextDate.setDate(newDate.getDate() + 7)
        this.usedDate = newDate.getDate().toString() + "-" + (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + " - " + nextDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "-" + nextDate.getFullYear().toString()
        console.log(this.usedDate)
      }
      else if(this.selected.innerHTML != "Day"){
        this.usedDate = "1" + "-" + (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString()
      }
      else {
        this.usedDate = newDate.getDate().toString() + "-" + (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString()
      }

      let dateDisplay = this.document.querySelector("#dateDisplay") as HTMLElement
      if(this.selected.innerHTML == "Week"){
        dateDisplay.innerHTML = this.usedDate.split("-")[0] + "/" + this.usedDate.split("-")[1] + "/" + this.usedDate.split("-")[2] + " - " + this.usedDate.split("-")[3] + "/" + this.usedDate.split("-")[4] + "/" + this.usedDate.split("-")[5]
      }
      else
      dateDisplay.innerHTML = this.usedDate.split("-")[0] + "/" + this.usedDate.split("-")[1] + "/" + this.usedDate.split("-")[2]


      this.createChart()
      this.selected.classList.add("selectBG")
    }
    else {
      this.selected = event.target
      this.selected.classList.add("selectBG")
      console.log(this.selected)
    }
  }

  openCalendar() {
    let calendar = this.document.querySelector(".p-calendar") as any
    console.log(calendar)
    if(calendar){
      calendar.style.display = "flex"
      if(this.selected.innerHTML == "Week"){
        this.calendarView = "date"
      }
      if(this.selected.innerHTML != "Week" && this.selected.innerHTML != "Day"){
        this.calendarView = this.selected.innerHTML.toLowerCase() as CalendarTypeView
      }
      else {
        this.calendarView = "date"
      }
      setTimeout(() => {
        calendar.style.opacity = "1"
        this.calendarHere = true
        this.document.addEventListener("click", ()=>{
          if(this.calendarHere){
            calendar.style.opacity = "0"
            setTimeout(() => {
              calendar.style.display = "none"
              this.calendarHere = false
            }, 500);
          }
        })
      }, 100);
    }
  }

  changeDate(event: Date){
    let stringDate = event.getDate().toString() + "-" + (event.getMonth() + 1).toString() + "-" + event.getFullYear().toString()
    this.usedDate = stringDate
    if(this.selected.innerHTML == "Week"){
      let nextDate = new Date()
      nextDate.setDate(event.getDate() + 7)
      this.usedDate = stringDate + " - " + nextDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "-" + nextDate.getFullYear().toString()
    }
    let calendar = this.document.querySelector(".p-calendar") as any

    if(calendar){
      calendar.style.opacity = "0"
      let dateDisplay = this.document.querySelector("#dateDisplay") as HTMLElement
      if(this.selected.innerHTML == "Week"){
        dateDisplay.innerHTML = this.usedDate.split("-")[0] + "/" + this.usedDate.split("-")[1] + "/" + this.usedDate.split("-")[2] + " - " + this.usedDate.split("-")[3] + "/" + this.usedDate.split("-")[4] + "/" + this.usedDate.split("-")[5]
      }
      else
      {
        dateDisplay.innerHTML = event.getDate().toString() + "/" + (event.getMonth() + 1).toString() + "/" + event.getFullYear().toString()
      }
      this.createChart()
      setTimeout(() => {
        calendar.style.display = "none"
      }, 500);
    }
  }

  updateDateFromArrows(side: string){
    let newDate = new Date((this.usedDate.split("-")[2] + "-" + this.usedDate.split("-")[1] + "-" + this.usedDate.split("-")[0]).replace(/\s/g, ''))
    let nextDate = new Date()

    if(side == "left"){

      if(this.selected.innerHTML == "Day"){
        newDate.setDate(newDate.getDate() - 1);
      }
      else if(this.selected.innerHTML == "Month"){
        newDate.setMonth(newDate.getMonth() - 1);
      }
      else if(this.selected.innerHTML == "Year"){
        newDate.setFullYear(newDate.getFullYear() - 1);
      }
      else{
        newDate.setDate(newDate.getDate() - 8);
        nextDate.setDate(newDate.getDate() + 7);
        console.log(newDate, nextDate)
      }

      this.usedDate = newDate.getDate().toString() + "-" + (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString()

      let dateDisplay = this.document.querySelector("#dateDisplay") as HTMLElement
      dateDisplay.innerHTML = this.usedDate.split("-")[0] + "/" + this.usedDate.split("-")[1] + "/" + this.usedDate.split("-")[2]

      if(this.selected.innerHTML == "Week"){
        this.usedDate = newDate.getDate().toString() + "-" + (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + " - " + nextDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "-" + nextDate.getFullYear().toString()
        console.log(this.usedDate)
        dateDisplay.innerHTML = this.usedDate.split("-")[0] + "/" + this.usedDate.split("-")[1] + "/" + this.usedDate.split("-")[2] + " - " + this.usedDate.split("-")[3] + "/" + this.usedDate.split("-")[4] + "/" + this.usedDate.split("-")[5]
      }

      this.createChart()
    }
    else if(side == "right"){
      if(this.selected.innerHTML == "Day"){
        newDate.setDate(newDate.getDate() + 1);
      }
      else if(this.selected.innerHTML == "Month"){
        newDate.setMonth(newDate.getMonth() + 1);
      }
      else if(this.selected.innerHTML == "Year"){
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
      else{
        newDate.setDate(newDate.getDate() + 8);
        nextDate.setDate(newDate.getDate() + 7);
        console.log(newDate, nextDate)
      }
      this.usedDate = newDate.getDate().toString() + "-" + (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString()

      let dateDisplay = this.document.querySelector("#dateDisplay") as HTMLElement
      dateDisplay.innerHTML = this.usedDate.split("-")[0] + "/" + this.usedDate.split("-")[1] + "/" + this.usedDate.split("-")[2]

      if(this.selected.innerHTML == "Week"){
        this.usedDate = newDate.getDate().toString() + "-" + (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + " - " + nextDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "-" + nextDate.getFullYear().toString()
        console.log(this.usedDate)
        dateDisplay.innerHTML = this.usedDate.split("-")[0] + "/" + this.usedDate.split("-")[1] + "/" + this.usedDate.split("-")[2] + " - " + this.usedDate.split("-")[3] + "/" + this.usedDate.split("-")[4] + "/" + this.usedDate.split("-")[5]
      }

      this.createChart()
    }
  }


  selectData(){
    let trueDat = 0
    let trueDate1 = 0
    let trueDate2 = 0
    this.total = 0

    for(let dat of this.transactions){
      console.log(this.total)
      console.log(dat.date, this.usedDate)

      if(this.selected.innerHTML == "Week"){
        let dateDisplay = this.document.querySelector("#dateDisplay") as HTMLElement
        let date1 = dateDisplay.innerHTML.split("-")[0]
        let date2 = dateDisplay.innerHTML.split("-")[1]

        trueDate1 = Date.parse((date1.split("/")[2] + "-" + date1.split("/")[1] + "-" + date1.split("/")[0]).replace(/\s/g, ''))
        trueDate2 = Date.parse((date2.split("/")[2] + "-" + date2.split("/")[1] + "-" + date2.split("/")[0]).replace(/\s/g, ''))

        trueDat = Date.parse(dat.date.split("-")[2] + "-" + dat.date.split("-")[1] + "-" + dat.date.split("-")[0])
      }

      if((this.selected.innerHTML == "Day" && dat.date == this.usedDate)
      || (this.selected.innerHTML == "Month" && dat.date.split("-")[1] == this.usedDate.split("-")[1] && dat.date.split("-")[2] == this.usedDate.split("-")[2])
      || (this.selected.innerHTML == "Year" && dat.date.split("-")[2] == this.usedDate.split("-")[2])
      || (this.selected.innerHTML == "Week" && trueDat >= trueDate1 && trueDat <= trueDate2)
      ){
          this.usedTransactions.push(dat)
          this.total += dat.price
      }

    }
  }

  createChart(){

    this.usedTransactions = []
    this.total = 0
    
    this.selectData()

    console.log(this.usedTransactions)
    console.log(this.categories)

    let chart = Chart.getChart("myChart")
    let chart2 = Chart.getChart("myChart2")
    let chart3 = Chart.getChart("myChart3")
    if(chart){
      chart.destroy()
    }
    if(chart2){
      chart2.destroy()
    }
    if(chart3){
      chart3.destroy()
    }

    let chartHTML = this.document.getElementById('myChart') as HTMLCanvasElement
    let chart2HTML = this.document.getElementById('myChart2') as HTMLCanvasElement
    let chart3HTML = this.document.getElementById('myChart3') as HTMLCanvasElement

    if(this.total == 0){
      if(chartHTML){
        chartHTML.style.display = "none"
        chart2HTML.style.display = "none"
        chart3HTML.style.display = "none"
      }
    }
    else if(chartHTML && chart2HTML){
        chartHTML.style.display = "block"
        chart2HTML.style.display = "block"
        chart3HTML.style.display = "block"
      }

      console.log(this.categories[9].title)

 
    new Chart(
      this.document.getElementById('myChart') as HTMLCanvasElement,
      {
        type: 'doughnut',
        data: {
          labels: this.usedTransactions.map(row => this.categories.find((category) => category.id == row.category_id)?.title),
          datasets: [
            {
              label: 'Spent Amount',
              data: this.usedTransactions.map(row => row.price),
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.7,
          plugins :{
            legend:{
              labels: {
                font: {
                  family: 'Calibri',
                  size: 15
                }
              },
          },
          
        },
        
      },
      plugins: [{
        id: this.total.toString(),
        
        beforeDraw: function(chart, a, b) {
          let width = chart.width,
            height = chart.height,
            ctx = chart.ctx;
    
          ctx.restore();
          let fontSize = (height / 154).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
    
          let text =this.id + "€",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 1.85;
    
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }]
      })

      
      new Chart(
        this.document.getElementById('myChart2') as HTMLCanvasElement,
        {
          type: 'bar',
          data: {
            labels: this.usedTransactions.map(row => this.categories.find((category) => category.id == row.category_id)?.title),
            datasets: [
              {
                label: 'Spent Amount',
                data: this.usedTransactions.map(row => row.price),
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.7,
            scales: {
              y: {
                ticks: {
                  font: {
                    family: 'Calibri',
                    size: 15
                  }
                }
              },
              x:{
                ticks: {
                  font: {
                    family: 'Calibri',
                    size: 15
                  }
                }
              }
            },
            plugins: {
              legend:{
                labels: {
                  font: {
                    family: 'Calibri',
                    size: 15
                  }
                }
              },
              title: {
                display: true,
                text: 'Chart.js Bar Chart'
              }
            }
          },
})


new Chart(
  this.document.getElementById('myChart3') as HTMLCanvasElement,
  {
    type: 'line',
    data: {
      labels: this.usedTransactions.map(row => row.date),
      datasets: [
        {
          label: 'Spent Amount',
          data: this.usedTransactions.map(row => row.price),
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      scales: {
        y: {
          ticks: {
            font: {
              family: 'Calibri',
              size: 15
            }
          }
        },
        x:{
          ticks: {
            font: {
              family: 'Calibri',
              size: 15
            }
          }
        }
      },
      plugins: {
        legend:{
          labels: {
            font: {
              family: 'Calibri',
              size: 15
            }
          }
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart'
        }
      }
    },
})
  }

  addClick(){
    this.router.navigate(['/spend'])
  }

  
}
