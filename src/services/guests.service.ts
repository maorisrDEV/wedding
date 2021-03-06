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
    const url = 'http://localhost:3000/guests/getGuestById';
    return this.http.post(url, {id: '603d3815b139913ddc44117c'});
  }

  public updateGuestData(guest: IGuest): Observable<any> {
    const url = 'http://localhost:3000/guests/updateGuestData';
    return this.http.post(url, guest);
  }

}
