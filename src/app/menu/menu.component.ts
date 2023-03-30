import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  changeMode(Mode: string) {
    localStorage.setItem('mode', Mode);
  }
  openPdf(){
    window.open('/assets/Pulmocoach_tutorial.pdf')
  }
}
