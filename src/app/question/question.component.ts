import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
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
  hidden_hint: boolean = true;
  Show_CurrentImagePath = [true, true, true, true, true];
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

  isHint: boolean = false;

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

  // 0327 add
  Qusetion_Map = new Map([
    ['Aortic enlargement', 'v1'],
    ['Atelectasis', 'v2'],
    ['Calcification', 'Any signs of calcifications? They appear bright and white!'],
    ['Cardiomegaly', 'v4'],
    ['Clavicle fracture', 'v5'],
    ['Cardiomegaly', 'v1'],
    ['Clavicle fracture', 'v1'],
    ['Consolidation', 'v1'],
    ['Edema', 'v1'],
    ['Emphysema', 'Shape of the diaphragm: may be flattened bilaterally in chronic asthma or emphysema, may be flattened unilaterally in case of tension pneumothorax or foreign body aspiration'],
    ['Enlarged PA', 'v1'],
    ['ILD', 'v1'],
    ['Infiltration', 'v1' ],
    ['Lung Opacity', 'v1'],
    ['Lung cavity', 'v1'],
    ['Lung cyst', 'v1'],
    ['Mediastinal shift', 'v1'],
    ['Nodule/Mass', 'v1'],
    ['Pleural effusion', 'v1'],
    ['Pleural thickening', 'v1'],
    ['Pneumothorax', 'v1'],
    ['Pulmonary fibrosis', 'v1'],
    ['Rib fracture', 'v1'],
    ['COPD', 'v1'],
    ['Lung tumor', 'v1'],
    ['Pneumonia', 'v1'],
    ['Tuberculosis','']
  ]);
  //   ['key3', 'value3'],
  //   ['key1', 'value1'],
  //   ['key2', 'value2'],
  //   ['key3', 'value3'],
  //   ['key1', 'value1'],
  //   ['key2', 'value2'],
  //   ['key3', 'value3'],
  //   ['key1', 'value1'],
  //   ['key2', 'value2'],
  //   ['key3', 'value3'],
  //   ['key1', 'value1'],
  //   ['key2', 'value2'],
  //   ['key3', 'value3'],
  //   ['key1', 'value1'],
  //   ['key2', 'value2'],
  //   ['key3', 'value3'],
  //   ['key1', 'value1'],
  //   ['key2', 'value2'],
  //   ['key3', 'value3']
  // 0327 add

  constructor(private http: HttpClient){
  }

  async ngOnInit(){
    this.name = localStorage.getItem('name')!;
    this.mode = localStorage.getItem("mode") || "";
    this.questionNum = 2;

    const infos = JSON.parse(localStorage.getItem('infos') || '');
    const idNumL = infos['id_numL'];
    this.uid = idNumL;

    console.log(this.uid);
    
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

  async getRandomData(){//////
    const response = await fetch(this.dbUrl + '/item/'  + this.questionNum.toString());
    const data = await response.json();
    console.log(data);
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

    if(!this.isCustom){
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
    else{
      let i : number = 1;
      for (const [id, data] of Object.entries(Data)) {

        const question: string[][] = [];
        //const answer: any = {};
        let answer: Record<string, any> = {};
        const str: string = String(i);
        if(data['symptom'][this.customSymptom] == ''){
          answer[str] = ['NO', 'Not Answered']
        }
        else{
          answer[str] = ['YES', 'Not Answered']
        }

        this.questionList.push([['Do you see the presence of ' + this.customSymptom + 'in the CXR?']]);
        this.AnswerList.push(answer);
        this.ImgURL.push(this.imgDbURL + id + '.png');
        this.ImgLabelURL.push(this.imgLabelDbURL + id + '.png');
        i += 1;
      }
      /*this.questionList = [,
                        [['Do you see the presence of Pleural Effusion in the CXR?']],
                        [['Do you see the presence of Pleural Effusion in the CXR?']],
                        [['Do you see the presence of Pleural Effusion in the CXR?']],
                        [['Do you see the presence of Pleural Effusion in the CXR?']]];
      this.AnswerList = [{'1' : ['YES', 'Not Answered']},
                          {'2' : ['YES', 'Not Answered']},
                          {'3' : ['No', 'Not Answered']},
                          {'4' : ['YES', 'Not Answered']},
                          {'5' : ['No', 'Not Answered']}];
      this.ImgURL = ['assets/img/3b5957a38160102563037a3769a383be.png',
                    'assets/img/6cbf4295b5b72bc01ef6fd171ef7733e.png',
                    'assets/img/5ef0d0b605f39b09df42d293e87971e3.png',
                    'assets/img/851111c0d1373209b9cff31baf15dbe2.png',
                    'assets/img/02425334e92510da663eb913ad0632ea.png']
      this.ImgLabelURL = ['assets/img/3b5957a38160102563037a3769a383be_label.png',
                    'assets/img/6cbf4295b5b72bc01ef6fd171ef7733e_label.png',
                    'assets/img/5ef0d0b605f39b09df42d293e87971e3_label.png',
                    'assets/img/851111c0d1373209b9cff31baf15dbe2_label.png',
                    'assets/img/02425334e92510da663eb913ad0632ea_label.png']
      */
    }
    /*console.log(this.questionList)
    console.log(this.AnswerList)
    console.log(this.ImgURL)
    console.log(this.ImgLabelURL)*/
  }

  hintBtn(){
    this.isHint = !this.isHint;
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
    if(this.isCustom){
      this.AnswerList[this.currentQuestion][(this.currentQuestion+1).toString()][1] = option;
    }
    else{
      this.AnswerList[this.currentQuestion][symptom][1] = option;
    }
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

    this.hidden_hint = true;

  }

  getProgressPercent() {
    this.progress = ((((this.currentQuestion) * this.questionList[0].length + this.currentSubQuestion) / 
      (this.questionList.length * this.questionList[0].length))* 100)
      .toFixed(0)
      .toString();

    return this.progress;
  }

  hint_showed = 0;

  show_hint(){
    this.hidden_hint = !this.hidden_hint;
    if(!this.isCustom){
      this.hint_showed = this.hint_showed+1;
      if(this.hint_showed%2 === 1){
        var ele = document.getElementById("hint")as HTMLElement;;
        console.log(this.questionList[this.currentQuestion][this.currentSubQuestion][0]);
        const p =  (this.Qusetion_Map.get(this.questionList[this.currentQuestion][this.currentSubQuestion][0]))as string;
        console.log("this is p");
        console.log(typeof(p));
        ele.textContent = p;
      }
      else{
        var ele = document.getElementById("hint")as HTMLElement;;
        ele.textContent = "";
      }
    }
    else{
      this.isHint = !this.isHint;
      if(this.isHint){
        var ele = document.getElementById("hint")as HTMLElement;;
        ele.textContent = 'CP angle blunting is a useful sign for identifying Pleural Effusions.';
      }
      else{
        var ele = document.getElementById("hint")as HTMLElement;;
        ele.textContent = '';
      }
    }
  }

  showImg(option: number) {
    this.Show_CurrentImagePath[option] = !this.Show_CurrentImagePath[option]
    console.log("result: ", this.Show_CurrentImagePath[0], this.Show_CurrentImagePath[1], this.Show_CurrentImagePath[2])
  }

}

