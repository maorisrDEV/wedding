import { Component, OnInit } from '@angular/core';
// declare const confetti: any;


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // confetti.start();
  }

}
