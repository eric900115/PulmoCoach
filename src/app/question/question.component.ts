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
  public image_data: any = [];
  public ImgLabelURL: any = [];
  public currentQuestion: number = 0;
  public currentSubQuestion: number = 0;
  public points: number = 0;
  hidden_hint: boolean = true;
  Show_CurrentImagePath: any = [];
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
  dbUrl: String = 'https://is202.cs.nthu.edu.tw/app/';
  questionNum: number = 0;

  uid: string = 'eric20607';

  isHint: boolean = false;
  hint_val: string | undefined;

  customSymptom: string;
  customAbnormalityRate: number;
  customQuestionNum: number;
  customGender: string;

  imgDbURL: string = 'https://is202.cs.nthu.edu.tw/test/';
  imgLabelDbURL: string = 'https://is202.cs.nthu.edu.tw/test_answer/';

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
    ['Aortic Enlargement', 'Aortic Enlargement: Evaluate for widened mediastinum, increased aortic silhouette, tracheal deviation, or loss of aortic knob contour. Compare with previous imaging if available. Consider causes like aneurysm, dissection, or atherosclerosis.'],
    ['Atelectasis', 'Atelectasis: Identify signs of volume loss, such as lung opacity, shifted mediastinum or trachea, and elevated diaphragm. Determine the cause, like bronchial obstruction, mucous plugging, or postoperative changes.'],
    ['Calcification', 'Calcification: Look for bright white, high-density areas in soft tissue, vessels, or lung parenchyma. Distinguish from hardware, foreign bodies, or artifacts. Evaluate for causes like granulomas, healed infections, or benign tumors.'],
    ['Cardiomegaly', 'Cardiomegaly: Assess for enlarged cardiac silhouette, cardiothoracic ratio >0.5, and evaluate for underlying heart disease, such as congestive heart failure, cardiomyopathy, or pericardial effusion.'],
    ['Clavicle Fracture', 'Clavicle Fracture: Inspect the clavicle for discontinuity, displacement, or angulation, paying close attention to the middle third, as it is the most common fracture site. Evaluate for associated injuries, such as pneumothorax or brachial plexus injury.'],
    ['Consolidation', 'Consolidation: Search for homogenous lung opacification, air bronchograms, or silhouette sign. Often caused by pneumonia or pulmonary edema; consider other etiologies like hemorrhage or malignancy.'],
    ['Edema', 'Edema: Look for interstitial thickening, peribronchial cuffing, or Kerley lines (A, B, or C). Bilateral hazy lung opacities may indicate pulmonary edema. Consider cardiac or non-cardiac causes.'],
    ['Emphysema', 'Emphysema: Identify hyperlucent lung fields, decreased vascular markings, and flattened diaphragms. Observe for bullae, areas of focal parenchymal destruction, or pneumothorax. Evaluate for underlying COPD.'],
    ['Enlarged Pa', 'Enlarged PA: Look for increased pulmonary artery diameter, abrupt tapering or "pruning" of peripheral vessels. Consider causes like pulmonary hypertension, pulmonary embolism, or vasculitis.'],
    ['ILD', 'ILD (Interstitial Lung Disease): Identify reticular, nodular, or ground-glass opacities, and distribution (central or peripheral). Assess for honeycombing or traction bronchiectasis. Consider various etiologies like idiopathic pulmonary fibrosis or connective tissue diseases.'],
    ['Infiltration', 'Infiltration: Look for ill-defined lung opacities, which may represent infection, inflammation, or edema. Consider bronchopneumonia, atypical pneumonia, or non-infectious causes like aspiration or pulmonary hemorrhage.'],
    ['Lung Opacity', 'Lung Opacity: Assess for focal or diffuse opacities, which may represent consolidation, mass, or atelectasis. Determine the underlying cause, such as infection, tumor, or post-obstructive collapse.'],
    ['Lung Cavity', 'Lung Cavity: Identify a gas-filled space within a pulmonary consolidation, mass, or nodule. Evaluate for underlying causes like abscess, necrotizing pneumonia, or cavitating malignancy.'],
    ['Lung Cyst', 'Lung Cyst: Look for well-defined, thin-walled, air-filled spaces in the lung parenchyma. Consider causes like emphysema, Langerhans cell histiocytosis, or lymphangioleiomyomatosis.'],
    ['Mediastinal Shift', 'Mediastinal Shift: Observe for deviation of trachea, heart, or mediastinal structures. Evaluate for causes like atelectasis, pleural effusion, pneumothorax, or mass. Assess for associated complications.'],
    ['Nodule / Mass', 'Nodule/Mass: Examine for well-defined, round opacities in lung parenchyma. Assess size, borders, and growth rate. Consider benign or malignant etiologies, and follow imaging guidelines.'],
    ['Pleural Effusion', 'Pleural Effusion: Look for blunting of costophrenic angles, meniscus sign, or layering fluid on lateral decubitus view. Assess for underlying causes like heart failure, infection, or malignancy.'],
    ['Pleural Thickening', 'Pleural Thickening: Identify areas of increased pleural density or irregularity. Consider causes like pleural plaques, fibrosis, or malignancy. Assess for asbestos exposure or previous infections.'],
    ['Pneumothorax', 'Pneumothorax: Examine for visceral pleural line, absent lung markings, or deep sulcus sign. Assess for tension pneumothorax with mediastinal shift. Determine underlying cause and management.'],
    ['Pulmonary Fibrosis', 'Pulmonary Fibrosis: Look for reticular opacities, honeycombing, and traction bronchiectasis. Assess for peripheral or basal predominance. Consider idiopathic pulmonary fibrosis or connective tissue diseases.'],
    ['Rib Fracture', 'Rib Fracture: Carefully examine ribs for cortical breaks, step-offs, or displacement, as they can be subtle. Consider oblique views or CT if clinically indicated. Evaluate for associated injuries like pneumothorax or pulmonary contusion.'],
    ['Copd', 'COPD (Chronic Obstructive Pulmonary Disease): Assess for hyperinflation, flattened diaphragms, and increased retrosternal airspace. Look for bullae or emphysematous changes. Evaluate for acute exacerbation or comorbidities.'],
    ['Lung Tumor', 'Lung Tumor: Examine for focal lung opacity with irregular or speculated margins. Assess size, growth, and associated lymphadenopathy or metastases. Consider biopsy or follow-up imaging.'],
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
    this.questionNum = 1;
    const infos = JSON.parse(localStorage.getItem('infos') || '');
    const idNumL = infos['id_numL'];
    this.uid = idNumL;

    if (this.mode == 'Random Quiz') {
      this.getRandomQuestions();
      this.isCustom = false;
    }
    else if (this.mode == 'Custom Quiz') {
      this.isCustom = true;
    }
  }

  customMenuDone(data: {
    customAbnormalityRate: number,
    customQuestionNum: number, 
    customGender: string, 
    Symptom: any[] 
  }) {
    
    this.isCustomMenuFinished = true;
    this.isStart = true;
    this.customAbnormalityRate = data.customAbnormalityRate
    this.customQuestionNum = data.customQuestionNum
    this.customGender = data.customGender
    this.customSymptom = data.Symptom.toString()
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

  async getRandomData(){//////
    const response = await fetch(this.dbUrl + 'item/'  + this.questionNum.toString());
    const data = await response.json();
    return data;
  }

  async getCustomData() {
    let url = this.dbUrl + 'custom';

    const requestData = {
      'symptom': this.customSymptom,
      'gender': this.customGender,
      'questionNum': this.customQuestionNum,
      'abnormalityRate': this.customAbnormalityRate
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
    for (const [id, data] of Object.entries(Data)) {
      this.ImgURL.push(this.imgDbURL + data.name + ".png");
      this.ImgLabelURL.push(this.imgLabelDbURL + data.name + ".png");
      this.questionList.push(data.question);
      this.AnswerList.push(data.answer);
      this.Show_CurrentImagePath.push(true);
    }    
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
    //if (this.isCustom) {
    //  this.AnswerList[this.currentQuestion][(this.currentQuestion + 1).toString()][1] = option;
    //}
    //else {
      this.AnswerList[this.currentQuestion][symptom][1] = option;
    //}
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
    var datetime = currentdate.getFullYear() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getDate()  + " "  
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
    //console.log(this.questionList[this.currentQuestion][this.currentSubQuestion][0]);
    this.hidden_hint = !this.hidden_hint;
    this.hint_val = this.Qusetion_Map.get(this.questionList[this.currentQuestion][this.currentSubQuestion][0]) as string;
  }

  showImg(option: number) {
    this.Show_CurrentImagePath[option] = !this.Show_CurrentImagePath[option]
    // console.log("result: ", this.Show_CurrentImagePath[0], this.Show_CurrentImagePath[1], this.Show_CurrentImagePath[2])
  }

}

