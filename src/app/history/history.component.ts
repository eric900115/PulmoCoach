import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {

  dbUrl: String = 'http://127.0.0.1:5000/';
  uid: string = 'eric20607';

  records: any = [];

  constructor(){
  }

  async ngOnInit(){
    await this.getHistory();
  }

  async getHistory(){
    const response = await fetch(this.dbUrl + 'result/'  + this.uid);
    const data = await response.json();
    this.records = Object.entries(data)[0][1];
  }

}
