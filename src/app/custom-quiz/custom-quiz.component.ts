import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-quiz',
  templateUrl: './custom-quiz.component.html',
  styleUrls: ['./custom-quiz.component.scss']
})
export class CustomQuizComponent {
  @Input() isCustom: boolean = true;
  @Input() isCustomMenuFinished: boolean = true;
  @Input() customAbnormalityRate: number = 0;
  @Input() customQuestionNum: number = 1;
  @Input() customGender: string = 'Select';
  @Input() Symptom: any[] = [];

  @Output() buttonClick = new EventEmitter<void>();

  selectedSymptom: string = ''; // Initialize selectedSymptom as an empty string

  customMenuDone() {
    this.buttonClick.emit();
  }

}
