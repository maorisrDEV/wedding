import {Component, OnInit} from '@angular/core';
import {GuestsService} from '../../services/guests.service';
import {IGuest} from '../../interfaces/interfaces';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  guestId = null;
  guestData: IGuest = null;
  loading = true;
  lat = 32.445022;
  lng = 34.937016;

  constructor(private guestService: GuestsService, private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.guestId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.guestId) {
      this.increaseVisits();
    } else {
      this.router.navigateByUrl('/404');
    }

  }

  ngOnInit(): void {
    if (this.guestId) {
      this.guestService.getGuestByID(this.guestId).subscribe(response => {
        if (response) {
          this.guestData = response;
          this.loading = false;
        } else {
          this.router.navigateByUrl('/404');
        }
      });
    }
  }

  handleAddGuest(): void {
    if (this.guestData.amountOfGuests) {
      this.guestData.amountOfGuests++;
    } else {
      this.guestData.amountOfGuests = 1;
    }
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
    if (this.guestData.amountOfGuests === 0 && this.guestData.willArrive === 'yes') {
      alert('שים לב: סימנת שהינך מגיע לאירוע אך כמות האורחים שווה לאפס. אנא עדכן את סטטוס ההגעה שנית.');
      return;
    }
    if (this.guestData.amountOfGuests > 0 && this.guestData.willArrive === 'no') {
      alert('שים לב: סימנת שאינך מתכוון להגיע לאירוע אך כמות האורחים גדולה מאפס. אנא עדכן את סטטוס ההגעה שנית.');
      return;
    }
    this.guestService.updateGuestData(this.guestData).subscribe(response => {
      if (response) {
        if (this.guestData.willArrive === 'yes') {
          alert('סטטוס ההגעה עודכן בהצלחה - מתרגשים ומצפים לבואכם!\n' +
            'שימו לב - ניתן לעדכן את סטטוס ההגעה בכל עת.');
        } else {
          alert('סטטוס ההגעה עודכן בהצלחה.\n' +
            'שימו לב - ניתן לשנות את סטטוס ההגעה בכל עת.');
        }
      } else {
        alert('ארעה שגיאה בעדכון סטטוס ההגעה. אנא נסו מאוחר יותר');
      }
    });
  }

  messageTextChanged($event: any): void {
    this.guestData.message = $event.target.value;

  }

  increaseVisits(): void {
    this.guestService.increaseCounterOfVisits(this.guestId).subscribe(() => {
    });
  }

  validateForm(): boolean {
    console.log(this.guestData);
    return this.guestData?.amountOfGuests !== null && this.guestData?.willArrive !== null;
  }
}
