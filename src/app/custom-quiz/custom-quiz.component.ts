import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-custom-quiz',
  templateUrl: './custom-quiz.component.html',
  styleUrls: ['./custom-quiz.component.scss']
})
export class CustomQuizComponent implements OnInit {
  customAbnormalityRate: number = 0;
  customQuestionNum: number = 1;
  customGender: string = 'Select';
  @Input() isCustom: boolean = true;
  @Input() isCustomMenuFinished: boolean = true;
  @Input() Symptom: any[] = [];


  @Output() buttonClick = new EventEmitter();

  // selectedSymptom: string = ''; // Initialize selectedSymptom as an empty string
  CQform = new FormGroup({
    Anomaly_Rate: new FormControl(''),
    Num_of_Q: new FormControl(''),
    Gender: new FormControl(''),
  });
  constructor() { }

  ngOnInit() { }

  customMenuDone() {
    var selectedSymptoms = this.Symptom.filter(item => item.selected !== false);
    var selectedValues = selectedSymptoms.map(item => item.value);
    this.buttonClick.emit({
      customAbnormalityRate: this.customAbnormalityRate,
      customQuestionNum: this.customQuestionNum,
      customGender: this.customGender,
      Symptom: selectedValues
    });
  }

}
