import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Payment} from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly API_URL = 'http://localhost:8000/api/auth/payment';

  constructor(private http: HttpClient) { }

  getPaymentList(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}`);
  }
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.API_URL}/${id}`);
  }
  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.API_URL, payment);
  }
  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
  updatePayment(payment: Payment): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${payment.paymentId}`, payment);
  }
  // getCategory(): Observable<any> {
  //   return this.http.get(`${this.API_URL}`);
  // }
}
