import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  records = [
    { id: '00', date: '2023 03 15 23:00', quiz_type: 'Random', pass: 15, result: 22},
    { id: '01', date: '2023 03 20 13:00', quiz_type: 'Custom', pass: 10, result: 22},
    { id: '02', date: '2023 03 21 09:00', quiz_type: 'Random', pass: 9, result: 22},
    { id: '03', date: '2023 03 22 21:20', quiz_type: 'Random', pass: 19, result: 22},
  ];
}
