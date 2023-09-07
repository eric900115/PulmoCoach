import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-customquizform',
  templateUrl: './customquizform.component.html',
  styleUrls: ['./customquizform.component.scss']
})
export class CustomquizformComponent {
  CQform = new FormGroup({
    Anomaly_Rate: new FormControl(''),
    Num_of_Q: new FormControl(''),
    Gender: new FormControl(''),
  });
}
