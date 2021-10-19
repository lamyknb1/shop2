import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { Picture } from '../models/picture';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private readonly API_URL = 'http://localhost:8000/api/auth/picture';
  private readonly API_URL2 = 'http://localhost:8000/api/auth/addPicture';
  private readonly API_URL1 = 'http://localhost:8000/api/auth/picture1';

  constructor(private http: HttpClient) { }

  getListPicture(): Observable<Picture[]> {
    return this.http.get<Picture[]>(`${this.API_URL}`);
  }
  getPictureById(id: number): Observable<Picture> {
    return this.http.get<Picture>(`${this.API_URL}/${id}`);
  }
  // createPicture(picture: Picture): Observable<Picture> {
  //   return this.http.post<Picture>(this.API_URL, picture);
  // }
  postPicture(preview): Observable<Picture> {
    console.log(preview);
    return this.http.post<Picture>(this.API_URL2, {
      src: preview
    });
  }
  deletePicture(pictureId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${pictureId}`);
  }
  putPicture(picture: Picture): Observable<Picture> {
    return this.http.put<Picture>(`${this.API_URL}/${picture.pictureId}`, picture);
  }
  // test get img
  getListPicture1(id: number): Observable<Picture[]> {
    return this.http.get<Picture[]>(`${this.API_URL1}/${id}`);
  }
}
