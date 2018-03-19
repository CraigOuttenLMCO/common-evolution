import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpInterceptorService } from '@covalent/http';
import 'rxjs/add/operator/map';

// andrew begin
import { Observable } from 'rxjs/Observable';
// andrew end

export interface IProduct {
  item_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
}

@Injectable()
export class ProductsService {
  
  constructor(private _http: HttpInterceptorService) {}

  //query(): any { // original
  query(): Observable<IProduct[]> {
   return this._http.get('data/products.json')
   .map((res: Response) => {
     return res.json();
   });
  }

  //get(id: string): any { // original
  get(id: string): Observable<IProduct> {
   return this._http.get('data/products.json')
   .map((res: Response) => {
     let item: any;
     res.json().forEach((s: any) => {
       if (s.item_id === id) {
         item = s;
       }
     });
     return item;
   });
  }
}
