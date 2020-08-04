import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.apiUrl;

  getAll(query: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, { params: query });
  }

  store(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  updateById(id: string, data: IUser): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, data);
  }

  destroyById(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}
