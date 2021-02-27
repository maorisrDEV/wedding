import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public numOfGuests = 0;
  lat = 13;
  lng = 80;

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
