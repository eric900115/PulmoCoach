import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements AfterViewInit  {
  
  constructor(private router: Router,  private ngZone: NgZone) {}
 
  ngAfterViewInit(): void {

    google.accounts.id.initialize({
      client_id: "752476887018-vvo95p3init8ojkmu7arnkamhmtqrip1.apps.googleusercontent.com",
      callback: this.startQuiz.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById("log_in"),
      {
        theme: "outline",
        size: "large",
        textConfig: {
          locale: "en"
        }
      } // customization attributes
    );

    google.accounts.id.prompt(); // also display the One Tap dialog

  }

  handleCredentialResponse(response: any) {

    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = this.decodeJwtResponse(response.credential);

    let infos = {
      fullnameL: responsePayload.name,
      photo_linkL: responsePayload.picture,
      firstL: responsePayload.given_name,
      lastL: responsePayload.family_name,
      mailL: responsePayload.email,
      id_numL: responsePayload.sub
    }

    let infosL = JSON.stringify(infos)

    localStorage.setItem("infos", infosL)

    //console.log(infosL);
  }

  decodeJwtResponse(data: any) {
    let tokens = data.split(".");
    return JSON.parse(atob(tokens[1]))
  }

  navigateToMenu() {
    this.ngZone.run(() => {
      this.router.navigateByUrl('/menu');
    });
  }

  startQuiz(response: any) {
    this.handleCredentialResponse(response);
    this.navigateToMenu();
  }
}
