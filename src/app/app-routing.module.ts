import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { QuestionComponent } from './question/question.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HistoryComponent } from './history/history.component';
import { RandomQuizComponent } from './random-quiz/random-quiz.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';

const routes: Routes = [
  {path:"", redirectTo:"welcome", pathMatch:'full'},
  {path:"welcome", component:WelcomeComponent},
  {path:"question", component:QuestionComponent},
  {path:"random_quiz", component:RandomQuizComponent},
  {path:"quiz", component:QuizPageComponent},
  {path:"menu", component:MenuComponent},
  {path:"history", component:HistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
