import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { QuestionService } from './../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  public name: string = '';
  public questionList: any = [];
  public AnswerList: Record<string, any>[] = [];
  public ImgURL: any = [];
  public ImgLabelURL: any = [];
  public currentQuestion: number = 0;
  public currentSubQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isQuizCompleted: boolean = false;

  isStart: boolean = false;
  isCustom: boolean = true; // if it's Random Mode, then isCustom will be false
  isCustomMenuFinished: boolean = false;

  mode: String = '';
  dbUrl: String = 'http://127.0.0.1:5000/';
  questionNum: number = 0;

  uid: string = 'eric20607';

  customSymptom: string;
  customAbnomarlityRate: number;
  customQuestionNum: number;
  customGender: string;

  firebaseStorage: string = 'https://storage.googleapis.com/pulmocoach-a3593.appspot.com/'
  imgDbURL: string = this.firebaseStorage + 'test/';
  imgLabelDbURL: string = this.firebaseStorage + 'test_label/';

  Gender = [
    'Male',
    'Female',
    'Both'
  ];

  Symptom = [
    'Aortic enlargement',
    'Atelectasis',
    'Calcification',
    'Cardiomegaly',
    'Clavicle fracture',
    'Consolidation',
    'Edema',
    'Emphysema',
    'Enlarged PA',
    'ILD',
    'Infiltration', 
    'Lung Opacity',
    'Lung cavity',
    'Lung cyst',
    'Mediastinal shift',
    'Nodule/Mass',
    'Pleural effusion',
    'Pleural thickening',
    'Pneumothorax',
    'Pulmonary fibrosis',
    'Rib fracture',
    'COPD',
    'Lung tumor',
    'Pneumonia',
    'Tuberculosis'
  ];

  constructor(private http: HttpClient){
  }

  async ngOnInit(){
    this.name = localStorage.getItem('name')!;
    this.mode = localStorage.getItem("mode") || "";
    this.questionNum = 2;
    
    if(this.mode == 'Random Quiz'){
      this.getRandomQuestions();
      this.isCustom = false;
    }
    else if(this.mode == 'Custom Quiz'){
      this.isCustom = true;
    }
  }

  customMenuDone(){
    this.isCustomMenuFinished = true;
    this.getCustomQuestions();
  }

  async getRandomQuestions(){
    const data = await this.getRandomData();
    this.getQuestions(data);
  }

  async getCustomQuestions(){
    const data = await this.getCustomData();
    this.getQuestions(data);
  }

  async getRandomData(){
    const response = await fetch(this.dbUrl + '/item/'  + this.questionNum.toString());
    const data = await response.json();
    return data;
  }

  async getCustomData(){
    let url = this.dbUrl + 'custom';

    const requestData = {
      'symptom' : this.customSymptom,
      'gender' : this.customGender,
      'questionNum' : this.customQuestionNum,
      'abnormalityRate' : this.customAbnomarlityRate
    }

    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    }

    const response = await fetch(url, config);
    const data = await response.json();

    return data;
  }

  getQuestions(Data: Object){
  
    for (const [id, data] of Object.entries(Data)) {

      const question: string[][] = [];
      //const answer: any = {};
      let answer: Record<string, any> = {};
      
      for(const [symptom, v] of Object.entries(data['symptom'])){
        
        question.push([symptom, 'YES', 'NO']);

        if(v == ''){
          answer[symptom] = ['NO', 'Not Answered'];
        }
        else{
          answer[symptom] = ['YES', 'Not Answered'];
        }
      }

      this.questionList.push(question);
      this.AnswerList.push(answer);
      this.ImgURL.push(this.imgDbURL + id + '.png');
      this.ImgLabelURL.push(this.imgLabelDbURL + id + '.png');
    }
  }

  startQuiz(){
    this.isStart = true;
  }

  isQuizFinished(){
    return (this.currentQuestion == this.questionList.length - 1) && 
          (this.currentSubQuestion == this.questionList[this.questionList.length - 1].length - 1);
  }

  prevQuestion() {
    // go to previous question
    if(this.currentSubQuestion == 0){
      this.currentSubQuestion = this.questionList[this.currentQuestion - 1].length - 1;
      this.currentQuestion -= 1;
    }
    else{
      this.currentSubQuestion--;
    }
  }

  nextQuestion(){
    // go to next question
    if(this.currentSubQuestion != this.questionList[this.currentQuestion].length - 1){
      this.currentSubQuestion++;
    }
    else{
      this.currentQuestion++;
      this.currentSubQuestion = 0;
    }
  }

  recordAnswer(option: string){
    // this.AnswerList[this.currentQuestion][symptom][0] is the correct answer of problem
    // this.AnswerList[this.currentQuestion][symptom][1] is the answer entered by user
    const symptom: string = this.questionList[this.currentQuestion][this.currentSubQuestion][0];
    this.AnswerList[this.currentQuestion][symptom][1] = option;
  }

  calculateResult(){
    for(let answer of this.AnswerList){
      for(let key in answer){
        // your answer == correct answer
        if(answer[key][0] === answer[key][1]){
          this.correctAnswer++;
        }
        else{
          this.incorrectAnswer++;
        }
      }
    }
  }

  async postResult(){
    let url = this.dbUrl + 'result/' + this.uid;
    let options = {
      observe: 'response' as 'response'
    }

    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear() + " "  
                  + currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds();
    
    const result = [datetime, this.mode, this.correctAnswer, this.incorrectAnswer + this.correctAnswer];

    this.http.post<any>(url, result, options).subscribe(res =>{
      //console.log(res);
    });
  }

  endQuiz(){
    this.isQuizCompleted = true;
    this.calculateResult();
    this.postResult();
  }

  answer(option: string) {
    
    this.recordAnswer(option);

    if(this.isQuizFinished()){
      // Quiz Finished
      this.endQuiz();
    }
    else{
      // Go to the next question
      this.nextQuestion();
      this.getProgressPercent();
    }

  }

  getProgressPercent() {
    this.progress = ((((this.currentQuestion) * this.questionList[0].length + this.currentSubQuestion) / 
      (this.questionList.length * this.questionList[0].length))* 100)
      .toFixed(0)
      .toString();

    return this.progress;
  }

}