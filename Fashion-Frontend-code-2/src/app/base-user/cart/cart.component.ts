import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductDetailService} from '../../services/product-detail.service';
import {OrderService} from '../../services/order.service';
import {SizeService} from '../../services/size.service';
import { Router } from '@angular/router';
import {Payment} from '../../models/payment';
import {ProductDetail} from '../../models/productDetail';
import {Order} from '../../models/order';
import {Size} from '../../models/size';
import {Colors} from '../../models/colors';
import {TokenStorageService} from '../../auth/service-auth/token-storage.service';
import {StorageService} from '../../services/storage.service';
import {ColorService} from '../../services/color.service';
import {PaymentService} from '../../services/payment.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  order: Order;
  cartList: ProductDetail[];
  totalPrice = 0;
  sizes: Size[] = [];
  colors: Colors[] = [];
  payments: Payment[] = [];
  cartForm: FormGroup;

  constructor(private productDetailService: ProductDetailService,
              private token: TokenStorageService,
              private orderService: OrderService,
              private storage: StorageService,
              private sizeService: SizeService,
              private colorService: ColorService,
              private paymentService: PaymentService,
              private router: Router,
              private cartComponent: CartComponent,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.sizeService.getSizeList().subscribe(next => {
      this.sizes = next;
    }, error => {
      console.log(error);
    }, () => {
      console.log('complete');
    });

    this.colorService.getColorList().subscribe(next => {
      this.colors = next;
    }, error => {
      console.log(error);
    }, () => {
      console.log('complete');
    });

    this.paymentService.getPaymentList().subscribe(next => {
      this.payments = next;
    }, error => {
      console.log(error);
    }, () => {
      console.log('complete');
    });

    this.cartForm = this.fb.group({
      id: '',
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // tslint:disable-next-line:max-line-length
      phone: ['', [Validators.required, Validators.pattern('^(0|\\+84)(\\s|\\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\\d)(\\s|\\.)?(\\d{3})(\\s|\\.)?(\\d{3})$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      payment: ['', [Validators.required, Validators.minLength(3)]],
    });
    if (this.token.getToken()) {
      this.totalPrice = 0;
      this.orderService.getCart(this.token.getUserId()).subscribe(next => {
        this.order = next;
        this.productDetailService.findByOrderId(this.order.orderId).subscribe(next2 => {
          this.cartList = next2;
          console.log(next2);
          this.order.phoneOrder = this.order.user.phone;
          this.order.deliveryAddress = this.order.user.address;
          this.cartForm.patchValue({
            id: this.order.user.userId,
            username: this.order.user.username,
            password: this.order.user.password,
            email: this.order.user.email,
            phone: this.order.user.phone,
            address: this.order.user.address,
            payment: this.payments[0].paymentId
          });
        });
      }, error => {
        console.log(error);
      });
    } else {
      console.log(this.storage.getCart());
      this.totalPrice = 0;
      this.orderService.getItem(this.storage.getCart()).subscribe(nextCart => {
        this.order = nextCart;
        this.productDetailService.findByOrderId(this.storage.getCart()).subscribe(next6 => {
          this.cartList = next6;
          this.cartForm.patchValue({
            phone: this.order.phoneOrder = '',
            address: this.order.deliveryAddress = '',
            payment:  this.payments[0].paymentId
          });
        }, error => {
          console.log(error);
        });
      });
    }}

  total() {
    this.totalPrice = 0;
    for (const cart of this.cartList) {
      this.totalPrice += cart.quantity * cart.product.price;
    }
    const total = this.totalPrice;
    // document.getElementById('totalPrice').innerHTML = total.toLocaleString('it-IT', {style: 'currency', currency: 'VND'});

  }
  onChangeQuantity(event, cart) {
    // if (this.token.getToken()) {
    cart.quantity = event.target.value;
    this.productDetailService.updateProductDetail({
      id: cart.id,
      quantity: cart.quantity,
      size: {id: cart.size},
      color: {id: cart.color},
      product: {id: cart.product.id},
      order: {id: cart.order.id},
    }).subscribe(next => {
      console.log(next);
    });
    this.total();
    // }
  }

  onChangeSize(event, cart) {
    // if (this.token.getToken()) {
    cart.size = event.target.value;
    this.productDetailService.updateProductDetail({
      id: cart.id,
      quantity: cart.quantity,
      size: {id: cart.size},
      color: {id: cart.color},
      product: {id: cart.product.id},
      order: {id: cart.order.id},
    }).subscribe(next => {
      console.log(next);
    });
    // }
  }

  onChangeColor(event, cart) {
    // if (this.token.getToken()) {
    cart.color = event.target.value;
    this.productDetailService.updateProductDetail({
      id: cart.id,
      quantity: cart.quantity,
      size: {id: cart.size},
      color: {id: cart.color},
      product: {id: cart.product.id},
      order: {id: cart.order.id},
    }).subscribe(next => {
      console.log(next);
    });
    // }
  }

  createOrder() {
    const {value} = this.cartForm;
    // @ts-ignore
    this.order.payment = {id: value.payment};
    this.order.total = this.totalPrice;
    this.orderService.toOrder(this.order).subscribe(next => {
      console.log(next);
      if (!this.token.getToken()) {
        this.storage.remove();
      }
      window.location.reload();
    });
    // this.order.total = this.totalPrice;
    // this.orderService.toOrder(this.order).subscribe(next => {
    //   console.log(next);
    //   this.storage.remove();
    //   // window.location.reload();
    //   this.ngOnInit();
    // });
    const choice = confirm('Create order is succeed, do you want to see your order history?');
    if (choice) {
      this.router.navigate(['order/user/filter']);
    } else {
      this.router.navigate(['']);
    }
    this.cartComponent.ngOnInit();
  }

  onChangePhone(event) {
    this.order.phoneOrder = event.target.value;
  }

  onChangeAddress(event) {
    this.order.deliveryAddress = event.target.value;
  }
  // onChangePayment(event) {
  //   this.order.payment.id = event.target.value;
  // }

  deleteCart(id: number) {
    const choice = confirm('Are you sure to remove this product in your cart ?');
    if (choice) {
      this.productDetailService.deleteProductDetail(id)
        .subscribe(
          data => {
            console.log(data);
            this.ngOnInit();
            this.cartComponent.ngOnInit();
          },
          error => console.log(error)
        );
    }
  }

}
