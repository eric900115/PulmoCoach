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

  AboutUs = "\n    Medical imaging has been widely used as an \
examination method in hospitals due to its non-invasive characteristic. \
Among them, chest radiographs, also known as chest x-rays or CXRs, \
are the most common. However, there have not been \
many interactive resources that help medical school \
students and other healthcare providers learn how \
to interpret medical images. Therefore, the learning \
curve for chest radiograph interpretation can be \
steep and challenging for beginners.\
            \n\n\
    Based on this situation, our team, composed of \
members from departments of computer science, \
electrical engineering, biomedical engineering, and \
medicine, decided to build a website that can serve \
as a tutorial and self-evaluation resource aimed at \
assisting healthcare providers new to CXR \
interpretation in better understanding some of the \
most crucial findings in CXR. \
                \n\n\
    Our platform is free and open-source, and our \
data is also based on open-source atasets. There \
are plenty of interesting images with accurate \
lesion localization and annotations made by \
professional radiologists. So make sure to try \
it out! \
\n\n\
    We are looking forward to incorporating AI \
diffusion model assistance in the future to make \
image comparisons and lesion localization easier."
}
