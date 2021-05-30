import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {GuestsService} from '../services/guests.service';
import {IGuest} from '../../interfaces/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent, STATUS} from '../dialog-message/dialog-message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  guestId = null;
  guestData: IGuest = null;
  loading = true;
  // lat = 32.4446032;
  // lng = 34.9358856;
  lat = 32.48945826707851;
  lng = 34.94796574006896;
  showImage = false;

  @ViewChild('mapElement') public mapElement: ElementRef;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  constructor(private guestService: GuestsService, private router: Router,
              private activatedRoute: ActivatedRoute, private renderer: Renderer2,
              public dialog: MatDialog) {
    this.guestId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.guestId) {
      this.router.navigateByUrl('/404');
    }

  }

  ngOnInit(): void {
    // Add map controls
    if (this.guestId) {
      this.guestService.getGuestByID(this.guestId).subscribe(response => {
        if (response) {
          this.guestData = response;
          this.setMap();
          this.loading = false;
          const loader = this.renderer.selectRootElement('#loader');
          this.renderer.setStyle(loader, 'display', 'none');
          this.increaseVisits();
        } else {
          this.router.navigateByUrl('/404');
        }
      });
    }
  }

  setMap(): void {
    setTimeout(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoidHJtYm85MjEiLCJhIjoiY2tvNjJwdmRlMDdvbTJubnh4eDNibTViOCJ9.kBVtOIOT4vhtfHqcg6MSGg';
      this.map = new mapboxgl.Map({
        container: this.mapElement.nativeElement,
        style: this.style,
        zoom: 13,
        center: [this.lng, this.lat]
      });

      this.map.addControl(new mapboxgl.NavigationControl());

      const popup = new mapboxgl.Popup()
        .setLngLat([this.lng, this.lat])
        .setHTML(`<h1>גן האירועים טרה, החרש 19, קיסריה</h1>`);

      new mapboxgl.Marker({
        color: 'red',
        draggable: true
      }).setLngLat([this.lng, this.lat])
        .setPopup(popup)
        .addTo(this.map);
    }, 10);
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
    this.saveGuestData();
  }

  saveGuestData(): void {
    let valid = true;
    if ((this.guestData.amountOfGuests === 0 || !this.guestData.amountOfGuests) && this.guestData.willArrive === 'yes') {
      valid = false;
      this.dialog.open(DialogMessageComponent, {
        data: {
          status: STATUS.noGuestsNumberAndYes,
          message: 'סימנת שהינך מגיע לאירוע אך כמות האורחים שווה לאפס. אנא עדכן כמות האורחים המגיעים ולחץ על כפתור מגיע/ה שנית. תודה :)'
        }
      });
      this.guestData.willArrive = null;
      return;
    }
    if (this.guestData.amountOfGuests > 0 && this.guestData.willArrive === 'no') {
      valid = false;
      const dialog = this.dialog.open(DialogMessageComponent, {
        data: {
          status: STATUS.notArrivingAndMoreThenZeroGuest,
          message: `סימנת ש-${this.guestData.amountOfGuests} אורחים מגיעים אך בכל זאת סימנת שאתה לא מתכוון להגיע. האם להתעלם מכמות האורחים שמגיעים?`
        }
      });
      dialog.afterClosed().subscribe(res => {
        if (res === true) {
          this.guestData.amountOfGuests = 0;
          this.guestService.updateGuestData(this.guestData).subscribe(response => {
            if (response) {
              if (this.guestData.willArrive === 'yes') {
                this.dialog.open(DialogMessageComponent, {
                  data: {
                    status: STATUS.arrivingOK,
                    message: 'מתרגשים ומצפים לראותכם :)'
                  }
                });
              } else {
                this.dialog.open(DialogMessageComponent, {
                  data: {
                    message: 'סימנו שאינך מתכוון להגיע לאירוע.',
                    status: STATUS.notArrivingOK
                  }
                });
              }
            }
          });
        }
      });
    }


    if (valid) {
      this.guestService.updateGuestData(this.guestData).subscribe(response => {
        if (response) {
          if (this.guestData.willArrive === 'yes') {
            this.dialog.open(DialogMessageComponent, {
              data: {
                status: STATUS.arrivingOK,
                message: 'מתרגשים ומצפים לראותכם :)'
              }
            });
          } else {
            this.dialog.open(DialogMessageComponent, {
              data: {
                message: 'סימנו שאינך מתכוון להגיע לאירוע.',
                status: STATUS.notArrivingOK
              }
            });
          }
        }
      });
    }


  }

  messageTextChanged($event: any): void {
    this.guestData.message = $event.target.value;

  }

  increaseVisits(): void {
    this.guestService.increaseCounterOfVisits(this.guestId).subscribe(() => {
    });
  }

  handleCornerClick(): void {
    this.showImage = true;
    const modal = document.getElementById('myModal');
    if (modal.style.display === 'block') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'block';
    }

    // Get the <span> element that closes the modal
    const span: any = document.getElementsByClassName('close')[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = () => {
      modal.style.display = 'none';
      this.showImage = false;
      this.setMap();
    };

    modal.onclick = () => {
      modal.style.display = 'none';
      this.showImage = false;
      this.setMap();
    };

  }


}
