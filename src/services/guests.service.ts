import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IGuest} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GuestsService {

  constructor(public http: HttpClient) {
  }

  public getGuestByID(id: string): Observable<any> {
    // const url = 'http://localhost:3000/guests/getGuestById';
    const url = 'https://lm-wedding-backend.herokuapp.com/guests/getGuestById';
    return this.http.post(url, {id});
  }

  public updateGuestData(guest: IGuest): Observable<any> {
    // const url = 'http://localhost:3000/guests/updateGuestData';
    const url = 'https://lm-wedding-backend.herokuapp.com/guests/updateGuestData';
    return this.http.post(url, guest);
  }

  public increaseCounterOfVisits(id: string): Observable<any> {
    // const url = 'http://localhost:3000/guests/increaseVisits';
    const url = 'https://lm-wedding-backend.herokuapp.com/guests/increaseVisits';
    return this.http.post(url, {id});
  }

}
