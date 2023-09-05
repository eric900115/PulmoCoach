import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { QuestionComponent } from './question/question.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { HistoryComponent } from './history/history.component';
import { ComponentNameComponent } from './component-name/component-name.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RandomQuizComponent } from './random-quiz/random-quiz.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { CustomQuizComponent } from './custom-quiz/custom-quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    QuestionComponent,
    HeaderComponent,
    MenuComponent,
    HistoryComponent,
    ComponentNameComponent,
    SidebarComponent,
    RandomQuizComponent,
    QuizPageComponent,
    CustomQuizComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
