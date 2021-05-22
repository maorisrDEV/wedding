import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {GuestsService} from '../services/guests.service';
import {IGuest} from '../../interfaces/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import set = Reflect.set;
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '../dialog-message/dialog-message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit {
  guestId = null;
  guestData: IGuest = null;
  loading = true;
  lat = 32.4446032;
  lng = 34.9358856;
  showImage = false;

  @ViewChild('mapElement') public mapElement: ElementRef;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  constructor(private guestService: GuestsService, private router: Router,
              private activatedRoute: ActivatedRoute, private renderer: Renderer2,
              public dialog: MatDialog) {
    this.guestId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.guestId) {
      this.increaseVisits();
    } else {
      this.router.navigateByUrl('/404');
    }

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoidHJtYm85MjEiLCJhIjoiY2tvNjJwdmRlMDdvbTJubnh4eDNibTViOCJ9.kBVtOIOT4vhtfHqcg6MSGg';
      this.map = new mapboxgl.Map({
        container: this.mapElement.nativeElement,
        style: this.style,
        zoom: 13,
        center: [this.lng, this.lat]
      });

      const popup = new mapboxgl.Popup()
        .setLngLat([this.lng, this.lat])
        .setHTML(`<h1>גן האירועים יארה, כביש קיסריה גן שמואל</h1>`);

      const marker = new mapboxgl.Marker({
        color: 'red',
        draggable: true
      }).setLngLat([this.lng, this.lat])
        .setPopup(popup)
        .addTo(this.map);

      // Add map controls
      this.map.addControl(new mapboxgl.NavigationControl());
    }, 1000);
  }

  ngOnInit(): void {
    if (this.guestId) {
      this.guestService.getGuestByID(this.guestId).subscribe(response => {
        if (response) {
          this.guestData = response;
          this.loading = false;
          const loader = this.renderer.selectRootElement('#loader');
          this.renderer.setStyle(loader, 'display', 'none');
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
    this.saveGuestData();
  }

  saveGuestData(): void {
    if (this.guestData.amountOfGuests === 0 && this.guestData.willArrive === 'yes') {
      const dialogRef = this.dialog.open(DialogMessageComponent, {
        data: {
          isValid: false,
          message: 'סימנת שהינך מגיע לאירוע אך כמות האורחים שווה לאפס. אנא עדכן כמות האורחים המגיעים.'
        }
      });
      this.guestData.willArrive = null;
      return;
    }
    if (this.guestData.amountOfGuests > 0 && this.guestData.willArrive === 'no') {
      const dialogRef = this.dialog.open(DialogMessageComponent, {
        data: {
          isValid: false,
          message: 'סימנת שאינך מתכוון להגיע לאירוע אך כמות האורחים גדולה מאפס. במידה ואינך מתכוון להגיע, אנא סמן אפס בכמות האורחים ולחץ שוב על כפתור לא מגיע/ה.'
        }
      });
      this.guestData.willArrive = null;
      return;
    }
    this.guestService.updateGuestData(this.guestData).subscribe(response => {
      if (response) {
        if (this.guestData.willArrive === 'yes') {
          const dialogRef = this.dialog.open(DialogMessageComponent, {
            data: {
              isValid: true,
              message: 'מתרגשים ומצפים לראותכם :)'
            }
          });
        } else {
          const dialogRef = this.dialog.open(DialogMessageComponent, {
            data: {isValid: true}
          });
        }
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
    };

    modal.onclick = () => {
      modal.style.display = 'none';
      this.showImage = false;
    };

  }


}
