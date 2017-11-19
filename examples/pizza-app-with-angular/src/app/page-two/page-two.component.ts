import { Component, OnInit, Input, NgZone } from '@angular/core';
import phonon from 'phonon/dist/js/components/dialogs'

@Component({
  selector: 'app-page-two',
  templateUrl: './page-two.component.html',
  styleUrls: ['./page-two.component.css']
})
export class PageTwoComponent implements OnInit {
  action:string = null;  
  pizza:string = null;  
  @Input() app:object;
  
  constructor(private zone:NgZone) { }

  ngOnInit() {
    this.app.on({page: 'page-two', preventClose: true}, this)
  }

  onClose = (self) => {
    if (this.action !== null) {
      self.close()
    } else {
      phonon().alert('Before leaving this page, you must perform an action.', 'Action required')
    }
  },

  onHidden = () => {
    this.action = null
  },

  onHashChanged = (pizza) => {
    this.zone.run(() => { // <== added
      this.pizza = pizza
    });
  },

  onAction = (event) => {
    this.action = 'user-action'

    if (event.target.getAttribute('data-order') === 'order') {
      phonon().alert('Thank you for your order!', 'Dear customer')
    } else {
      phonon().alert('Your order has been canceled.', 'Dear customer')
    }
  }
}
