import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {GuestsService} from '../services/guests.service';
import {IGuest} from '../../interfaces/interfaces';
import {ActivatedRoute, Router} from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import set = Reflect.set;

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

  @ViewChild('mapElement') public mapElement: ElementRef;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  constructor(private guestService: GuestsService, private router: Router,
              private activatedRoute: ActivatedRoute, private renderer: Renderer2) {
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
