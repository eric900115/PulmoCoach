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

  // Symptom = [
  //   'Aortic enlargement',
  //   'Atelectasis',
  //   'Calcification',
  //   'Cardiomegaly',
  //   'Clavicle fracture',
  //   'Consolidation',
  //   'Edema',
  //   'Emphysema',
  //   'Enlarged PA',
  //   'ILD',
  //   'Infiltration', 
  //   'Lung Opacity',
  //   'Lung cavity',
  //   'Lung cyst',
  //   'Mediastinal shift',
  //   'Nodule/Mass',
  //   'Pleural effusion',
  //   'Pleural thickening',
  //   'Pneumothorax',
  //   'Pulmonary fibrosis',
  //   'Rib fracture',
  //   'COPD',
  //   'Lung tumor',
  //   'Pneumonia',
  //   'Tuberculosis'
  // ];
  Symptom = [
    { value: 'Aortic enlargement', selected: false },
    { value: 'Atelectasis', selected: false },
    { value: 'Calcification', selected: false },
    { value: 'Cardiomegaly', selected: false },
    { value: 'Clavicle fracture', selected: false },
    { value: 'Consolidation', selected: false },
    { value: 'Edema', selected: false },
    { value: 'Emphysema', selected: false },
    { value: 'Enlarged PA', selected: false },
    { value: 'ILD', selected: false },
    { value: 'Infiltration', selected: false },
    { value: 'Lung Opacity', selected: false },
    { value: 'Lung cavity', selected: false },
    { value: 'Lung cyst', selected: false },
    { value: 'Mediastinal shift', selected: false },
    { value: 'Nodule/Mass', selected: false },
    { value: 'Pleural effusion', selected: false },
    { value: 'Pleural thickening', selected: false },
    { value: 'Pneumothorax', selected: false },
    { value: 'Pulmonary fibrosis', selected: false },
    { value: 'Rib fracture', selected: false },
    { value: 'COPD', selected: false },
    { value: 'Lung tumor', selected: false },
    { value: 'Pneumonia', selected: false },
    { value: 'Tuberculosis', selected: false },
  ];

  // 0327 add
  Qusetion_Map = new Map([
    ['Aortic enlargement', 'Aortic Enlargement: Evaluate for widened mediastinum, increased aortic silhouette, tracheal deviation, or loss of aortic knob contour. Compare with previous imaging if available. Consider causes like aneurysm, dissection, or atherosclerosis.'],
    ['Atelectasis', 'Atelectasis: Identify signs of volume loss, such as lung opacity, shifted mediastinum or trachea, and elevated diaphragm. Determine the cause, like bronchial obstruction, mucous plugging, or postoperative changes.'],
    ['Calcification', 'Calcification: Look for bright white, high-density areas in soft tissue, vessels, or lung parenchyma. Distinguish from hardware, foreign bodies, or artifacts. Evaluate for causes like granulomas, healed infections, or benign tumors.'],
    ['Cardiomegaly', 'Cardiomegaly: Assess for enlarged cardiac silhouette, cardiothoracic ratio >0.5, and evaluate for underlying heart disease, such as congestive heart failure, cardiomyopathy, or pericardial effusion.'],
    ['Clavicle fracture', 'Clavicle Fracture: Inspect the clavicle for discontinuity, displacement, or angulation, paying close attention to the middle third, as it is the most common fracture site. Evaluate for associated injuries, such as pneumothorax or brachial plexus injury.'],
    ['Consolidation', 'Consolidation: Search for homogenous lung opacification, air bronchograms, or silhouette sign. Often caused by pneumonia or pulmonary edema; consider other etiologies like hemorrhage or malignancy.'],
    ['Edema', 'Edema: Look for interstitial thickening, peribronchial cuffing, or Kerley lines (A, B, or C). Bilateral hazy lung opacities may indicate pulmonary edema. Consider cardiac or non-cardiac causes.'],
    ['Emphysema', 'Emphysema: Identify hyperlucent lung fields, decreased vascular markings, and flattened diaphragms. Observe for bullae, areas of focal parenchymal destruction, or pneumothorax. Evaluate for underlying COPD.'],
    ['Enlarged PA', 'Enlarged PA: Look for increased pulmonary artery diameter, abrupt tapering or "pruning" of peripheral vessels. Consider causes like pulmonary hypertension, pulmonary embolism, or vasculitis.'],
    ['ILD', 'ILD (Interstitial Lung Disease): Identify reticular, nodular, or ground-glass opacities, and distribution (central or peripheral). Assess for honeycombing or traction bronchiectasis. Consider various etiologies like idiopathic pulmonary fibrosis or connective tissue diseases.'],
    ['Infiltration', 'Infiltration: Look for ill-defined lung opacities, which may represent infection, inflammation, or edema. Consider bronchopneumonia, atypical pneumonia, or non-infectious causes like aspiration or pulmonary hemorrhage.'],
    ['Lung Opacity', 'Lung Opacity: Assess for focal or diffuse opacities, which may represent consolidation, mass, or atelectasis. Determine the underlying cause, such as infection, tumor, or post-obstructive collapse.'],
    ['Lung cavity', 'Lung Cavity: Identify a gas-filled space within a pulmonary consolidation, mass, or nodule. Evaluate for underlying causes like abscess, necrotizing pneumonia, or cavitating malignancy.'],
    ['Lung cyst', 'Lung Cyst: Look for well-defined, thin-walled, air-filled spaces in the lung parenchyma. Consider causes like emphysema, Langerhans cell histiocytosis, or lymphangioleiomyomatosis.'],
    ['Mediastinal shift', 'Mediastinal Shift: Observe for deviation of trachea, heart, or mediastinal structures. Evaluate for causes like atelectasis, pleural effusion, pneumothorax, or mass. Assess for associated complications.'],
    ['Nodule/Mass', 'Nodule/Mass: Examine for well-defined, round opacities in lung parenchyma. Assess size, borders, and growth rate. Consider benign or malignant etiologies, and follow imaging guidelines.'],
    ['Pleural effusion', 'Pleural Effusion: Look for blunting of costophrenic angles, meniscus sign, or layering fluid on lateral decubitus view. Assess for underlying causes like heart failure, infection, or malignancy.'],
    ['Pleural thickening', 'Pleural Thickening: Identify areas of increased pleural density or irregularity. Consider causes like pleural plaques, fibrosis, or malignancy. Assess for asbestos exposure or previous infections.'],
    ['Pneumothorax', 'Pneumothorax: Examine for visceral pleural line, absent lung markings, or deep sulcus sign. Assess for tension pneumothorax with mediastinal shift. Determine underlying cause and management.'],
    ['Pulmonary fibrosis', 'Pulmonary Fibrosis: Look for reticular opacities, honeycombing, and traction bronchiectasis. Assess for peripheral or basal predominance. Consider idiopathic pulmonary fibrosis or connective tissue diseases.'],
    ['Rib fracture', 'Rib Fracture: Carefully examine ribs for cortical breaks, step-offs, or displacement, as they can be subtle. Consider oblique views or CT if clinically indicated. Evaluate for associated injuries like pneumothorax or pulmonary contusion.'],
    ['COPD', 'COPD (Chronic Obstructive Pulmonary Disease): Assess for hyperinflation, flattened diaphragms, and increased retrosternal airspace. Look for bullae or emphysematous changes. Evaluate for acute exacerbation or comorbidities.'],
    ['Lung tumor', 'Lung Tumor: Examine for focal lung opacity with irregular or speculated margins. Assess size, growth, and associated lymphadenopathy or metastases. Consider biopsy or follow-up imaging.'],
    ['Pneumonia', 'Pneumonia: Identify areas of consolidation, air bronchograms, or interstitial opacities. Determine lobar or bronchopneumonia patterns. Evaluate for underlying infection, aspiration, or atypical pneumonia.'],
    ['Tuberculosis', 'Tuberculosis: Look for upper lobe consolidation, cavitation, or calcification. Assess for miliary pattern, pleural effusion, or lymphadenopathy. Consider primary or reactivation tuberculosis and manage accordingly.']
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

  constructor(private http: HttpClient) {
  }

  async ngOnInit() {
    this.name = localStorage.getItem('name')!;
    this.mode = localStorage.getItem("mode") || "";
    this.questionNum = 2;
    this.customGender = 'Select';

    const infos = JSON.parse(localStorage.getItem('infos') || '');
    const idNumL = infos['id_numL'];
    this.uid = idNumL;

    console.log(this.uid);

    if (this.mode == 'Random Quiz') {
      this.getRandomQuestions();
      this.isCustom = false;
    }
    else if (this.mode == 'Custom Quiz') {
      this.isCustom = true;
    }
  }

  customMenuDone() {
    this.isCustomMenuFinished = true;
    this.getCustomQuestions();
  }

  async getRandomQuestions() {
    const data = await this.getRandomData();
    this.getQuestions(data);
  }

  async getCustomQuestions() {
    const data = await this.getCustomData();
    this.getQuestions(data);
  }

  async getRandomData() {//////
    const response = await fetch(this.dbUrl + '/item/' + this.questionNum.toString());
    const data = await response.json();
    console.log(data);
    return data;
  }

  async getCustomData() {
    let url = this.dbUrl + 'custom';

    const requestData = {
      'symptom': this.customSymptom,
      'gender': this.customGender,
      'questionNum': this.customQuestionNum,
      'abnormalityRate': this.customAbnomarlityRate
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

  getQuestions(Data: Object) {

    if (!this.isCustom) {
      for (const [id, data] of Object.entries(Data)) {

        const question: string[][] = [];
        //const answer: any = {};
        let answer: Record<string, any> = {};

        for (const [symptom, v] of Object.entries(data['symptom'])) {

          question.push([symptom, 'YES', 'NO']);

          if (v == '') {
            answer[symptom] = ['NO', 'Not Answered'];
          }
          else {
            answer[symptom] = ['YES', 'Not Answered'];
          }
        }

        this.questionList.push(question);
        this.AnswerList.push(answer);
        this.ImgURL.push(this.imgDbURL + id + '.png');
        this.ImgLabelURL.push(this.imgLabelDbURL + id + '.png');
      }
    }
    else {
      let i: number = 1;
      for (const [id, data] of Object.entries(Data)) {

        const question: string[][] = [];
        //const answer: any = {};
        let answer: Record<string, any> = {};
        const str: string = String(i);
        if (data['symptom'][this.customSymptom] == '') {
          answer[str] = ['NO', 'Not Answered']
        }
        else {
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

  hintBtn() {
    this.isHint = !this.isHint;
  }

  startQuiz() {
    this.isStart = true;
  }

  isQuizFinished() {
    return (this.currentQuestion == this.questionList.length - 1) &&
      (this.currentSubQuestion == this.questionList[this.questionList.length - 1].length - 1);
  }

  prevQuestion() {
    // go to previous question
    if (this.currentSubQuestion == 0) {
      this.currentSubQuestion = this.questionList[this.currentQuestion - 1].length - 1;
      this.currentQuestion -= 1;
    }
    else {
      this.currentSubQuestion--;
    }
  }

  nextQuestion() {
    // go to next question
    if (this.currentSubQuestion != this.questionList[this.currentQuestion].length - 1) {
      this.currentSubQuestion++;
    }
    else {
      this.currentQuestion++;
      this.currentSubQuestion = 0;
    }
  }

  recordAnswer(option: string) {
    // this.AnswerList[this.currentQuestion][symptom][0] is the correct answer of problem
    // this.AnswerList[this.currentQuestion][symptom][1] is the answer entered by user
    const symptom: string = this.questionList[this.currentQuestion][this.currentSubQuestion][0];
    if (this.isCustom) {
      this.AnswerList[this.currentQuestion][(this.currentQuestion + 1).toString()][1] = option;
    }
    else {
      this.AnswerList[this.currentQuestion][symptom][1] = option;
    }
  }

  calculateResult() {
    for (let answer of this.AnswerList) {
      for (let key in answer) {
        // your answer == correct answer
        if (answer[key][0] === answer[key][1]) {
          this.correctAnswer++;
        }
        else {
          this.incorrectAnswer++;
        }
      }
    }
  }

  async postResult() {
    let url = this.dbUrl + 'result/' + this.uid;
    let options = {
      observe: 'response' as 'response'
    }

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();

    const result = [datetime, this.mode, this.correctAnswer, this.incorrectAnswer + this.correctAnswer];

    this.http.post<any>(url, result, options).subscribe(res => {
      //console.log(res);
    });
  }

  endQuiz() {
    this.isQuizCompleted = true;
    this.calculateResult();
    this.postResult();
  }

  answer(option: string) {

    this.recordAnswer(option);

    if (this.isQuizFinished()) {
      // Quiz Finished
      this.endQuiz();
    }
    else {
      // Go to the next question
      this.nextQuestion();
      this.getProgressPercent();
    }

    this.hidden_hint = true;

  }

  getProgressPercent() {
    this.progress = ((((this.currentQuestion) * this.questionList[0].length + this.currentSubQuestion) /
      (this.questionList.length * this.questionList[0].length)) * 100)
      .toFixed(0)
      .toString();

    return this.progress;
  }

  hint_showed = 0;

  show_hint() {
    this.hidden_hint = !this.hidden_hint;
    if (!this.isCustom) {
      this.hint_showed = this.hint_showed + 1;
      if (this.hint_showed % 2 === 1) {
        var ele = document.getElementById("hint") as HTMLElement;;
        console.log(this.questionList[this.currentQuestion][this.currentSubQuestion][0]);
        const p = (this.Qusetion_Map.get(this.questionList[this.currentQuestion][this.currentSubQuestion][0])) as string;
        console.log("this is p");
        console.log(typeof (p));
        ele.textContent = p;
      }
      else {
        var ele = document.getElementById("hint") as HTMLElement;;
        ele.textContent = "";
      }
    }
    else {
      this.isHint = !this.isHint;
      if (this.isHint) {
        var ele = document.getElementById("hint") as HTMLElement;;
        ele.textContent = 'CP angle blunting is a useful sign for identifying Pleural Effusions.';
      }
      else {
        var ele = document.getElementById("hint") as HTMLElement;;
        ele.textContent = '';
      }
    }
  }

  showImg(option: number) {
    this.Show_CurrentImagePath[option] = !this.Show_CurrentImagePath[option]
    console.log("result: ", this.Show_CurrentImagePath[0], this.Show_CurrentImagePath[1], this.Show_CurrentImagePath[2])
  }

}

