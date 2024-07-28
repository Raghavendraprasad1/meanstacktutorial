import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }


  login(data:any): Observable<any>
  {
    console.log("data: ", data);
    return this.http.post<any>(environment.APIURL+"user/login", data);
  }


}
