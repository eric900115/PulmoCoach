import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { QuestionComponent } from './question/question.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HistoryComponent } from './history/history.component';
import { AuthGuard } from '../app/auth.guard';

const routes: Routes = [
  {
    path:"", 
    redirectTo:"welcome", 
    pathMatch:'full',
    canActivate: [AuthGuard],
    children: [
      {path:"welcome", component:WelcomeComponent},
      {path:"question", component:QuestionComponent},
      {path:"menu", component:MenuComponent},
      {path:"history", component:HistoryComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
