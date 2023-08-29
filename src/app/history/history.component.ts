import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {

  dbUrl: String = 'https://is202.cs.nthu.edu.tw/app/';
  uid: string = 'eric20607';

  records: any = [];

  constructor(){
  }

  async ngOnInit(){
    const infos = JSON.parse(localStorage.getItem('infos') || '');
    const idNumL = infos['id_numL'];
    this.uid = idNumL;
    console.log(this.uid)

    await this.getHistory();
  }

  async getHistory(){
    const response = await fetch(this.dbUrl + 'result/'  + this.uid);
    const data = await response.json();
    const entries = Object.entries(data);
    this.records = entries.map(entry => entry[1]);;
    console.log(Object.entries(data))
    console.log(this.records)
  }

}
