import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class SidebarComponent {
  @Input() isMenu: boolean = true;
  sideBarIsOpen: boolean;
  sideBarToggle() {
    this.sideBarIsOpen = !this.sideBarIsOpen;
  }

  ngOnInit() {
    this.sideBarIsOpen = this.isMenu;
  }
  changeMode(Mode: string) {
    localStorage.setItem('mode', Mode);
  }
  openPdf() {
    window.open('/assets/Pulmocoach_tutorial.pdf')
  }
}
