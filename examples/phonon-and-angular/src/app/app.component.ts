import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import phonon from 'phonon/dist/js/phonon-core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    '../../node_modules/phonon/dist/css/phonon.css'    
  ],
  encapsulation: ViewEncapsulation.None, 
})
export class AppComponent implements OnInit {
  title:string = 'Phonon + Angular';
  app:object = null

  ngOnInit() {
    this.app = phonon.navigator()

    phonon.options({
      navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true
      },
      i18n: null // for this example, we do not use internationalization
    })

    this.app.start();
  }
}
