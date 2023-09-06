import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-quiz',
  templateUrl: './custom-quiz.component.html',
  styleUrls: ['./custom-quiz.component.scss']
})
export class CustomQuizComponent implements OnInit {
  ngOnInit() {}

  @Input() isCustom: boolean = true;
  @Input() isCustomMenuFinished: boolean = true;
  @Input() customAbnormalityRate: number = 0;
  @Input() customQuestionNum: number = 1;
  @Input() customGender: string = 'Select';
  @Input() Symptom: any[] = [];

  @Output() buttonClick = new EventEmitter<void>();

  selectedSymptom: string = ''; // Initialize selectedSymptom as an empty string

  customMenuDone() {
    console.log("child emit:")
    console.log("customAbnormalityRate:", this.customAbnormalityRate)
    console.log("customQuestionNum:", this.customQuestionNum)
    console.log("customGender:", this.customGender)
    console.log("Symptom:", this.Symptom)

    this.buttonClick.emit();
  }

}
