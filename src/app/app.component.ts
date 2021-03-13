import {Component, OnInit} from '@angular/core';
import {GuestsService} from '../services/guests.service';
import {IGuest} from '../interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  lat = 32.445022;
  lng = 34.937016;
  guestData: IGuest = null;
  loading = true;

  constructor(private guestService: GuestsService) {
  }

  ngOnInit(): void {
    this.guestService.getGuestByID('test').subscribe(response => {
      this.guestData = response;
      this.loading = false;
    });
  }

  handleAddGuest(): void {
    this.guestData.amountOfGuests++;
  }

  handleRemoveGuest(): void {
    if (this.guestData.amountOfGuests >= 1) {
      this.guestData.amountOfGuests--;
    }
  }

  handleWillArriveBtnClicked(willArrive: string): void {
    this.guestData.willArrive = willArrive;
  }

  saveGuestData(): void {
    this.guestService.updateGuestData(this.guestData).subscribe(response => {
      if (response) {
        alert('סטטוס הגעה עודכן בהצלחה, מצפים לבואכם! שימו לב: ניתן לעדכן את סטטוס ההגעה בכל עת.');
      } else {
        alert('ארעה שגיאה בעדכון סטטוס ההגעה. אנא נסו מאוחר יותר');
      }
    });
  }

  messageTextChanged($event: any): void {
    this.guestData.message = $event.target.value;
  }
}
