import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-random-quiz',
  templateUrl: './random-quiz.component.html',
  styleUrls: ['./random-quiz.component.scss']
})
export class RandomQuizComponent implements OnInit {
  QuizHint = '\n    Since there are not enough CXRs that meet the requirement of the custom selection, the remaining questions will be replaced with normal CXRs.'
  @Output() RQstart = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  startQuiz() {
    this.RQstart.emit(true);
  }
}
