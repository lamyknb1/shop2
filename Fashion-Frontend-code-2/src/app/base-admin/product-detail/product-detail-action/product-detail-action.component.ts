import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ProductDetailService} from '../../../services/product-detail.service';
import {ProductDetail} from '../../../models/productDetail';

@Component({
  selector: 'app-product-detail-action',
  templateUrl: './product-detail-action.component.html',
  styleUrls: ['./product-detail-action.component.css']
})
export class ProductDetailActionComponent implements OnInit {

  subscription: Subscription;
  productDetailClass: ProductDetail;

  constructor(private productDetailService: ProductDetailService) { }

  ngOnInit(): void {
  }

  getDetailByProductId(id: number) {
    this.subscription = this.productDetailService.getProductDetailById(id).subscribe(
      data => {
        this.productDetailClass = data;
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
