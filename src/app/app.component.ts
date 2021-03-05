import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public numOfGuests = 0;
  lat = 32.445022;
  lng = 34.937016;

  constructor(httpClient: HttpClient) {
  }

  ngOnInit(): void {
  }

  handleAddGuest(): void {
    this.numOfGuests++;
  }

  handleRemoveGuest(): void {
    if (this.numOfGuests) {
      this.numOfGuests--;
    }
  }
}
