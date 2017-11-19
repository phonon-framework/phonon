import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() title:string;
  @Input() app:object;

  constructor() { }

  ngOnInit() {
    this.app.on({page: 'home', preventClose: true}, this)
  }

}
