import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DecimalPipe } from '@angular/common';
import { Utils } from '../utils';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected activeUser = signal<UserModel | null>(null);

  constructor(
    private router: Router,
    private utils: Utils,
  ) {
    if (!UserService.hasAuth()) {
      localStorage.setItem(UserService.TO_KEY, 'profile');
      this.router.navigateByUrl('/login');
      return;
    }
    this.activeUser.set(UserService.getActiveUser());
  }
  protected checkOut() {
    const user = UserService.getActiveUser();
    let activeCart = null;

    if (user && user.data) {
      for (let order of user.data) {
        if (order.items && order.items.status === 'active') {
          activeCart = order.items;
          break;
        }
      }
    }

    if (!activeCart || !activeCart.cartItems || activeCart.cartItems.length === 0) {
      this.utils.showAlert('Your cart is empty! Please add some toys before checking out.');
      return;
    }

    UserService.createOrder();
    this.utils.showAlert('Order successfully created, see updates on your profile page. :)');

    this.router.navigate(['/profile']);
  }

  protected getTotalPrice() {
    const user = this.activeUser();
    if (!user) return 0;

    const activeOrder = user.data.find((order) => order.items.status === 'active');
    if (!activeOrder || !activeOrder.items.cartItems) return 0;

    let total = 0;
    for (let item of activeOrder.items.cartItems) {
      total += item.quantity * item.item.price;
    }

    return total;
  }

  increment(toyId: number) {
    UserService.modifyCartItem(toyId, 1);
    this.activeUser.set(UserService.getActiveUser()); // Refreshes the signal to update UI
  }

  decrement(toyId: number) {
    UserService.modifyCartItem(toyId, -1);
    this.activeUser.set(UserService.getActiveUser());
  }

  remove(toyId: number) {
    UserService.modifyCartItem(toyId, 0); // Passing 0 acts as our delete trigger
    this.activeUser.set(UserService.getActiveUser());
  }
}
