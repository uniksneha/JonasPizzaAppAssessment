import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface PizzaSize {
  name: string;
  price: number;
}

interface Topping {
  name: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-pizza-order',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pizza-order.component.html',
  styleUrl: './pizza-order.component.css',
 

})
export class PizzaOrderComponent {
  pizzaSizes: PizzaSize[] = [
    { name: 'Small', price: 5 },
    { name: 'Medium', price: 7 },
    { name: 'Large', price: 8 },
    { name: 'Extra Large', price: 9 }
  ];

  toppingsMap: Map<string, Topping[]> = new Map();
  vegToppings: Topping[] = [
    { name: 'Tomatoes', price: 1.00, selected: false },
    { name: 'Onions', price: 0.50, selected: false },
    { name: 'Bell Pepper', price: 1.00, selected: false },
    { name: 'Mushrooms', price: 1.20, selected: false },
    { name: 'Pineapple', price: 0.75, selected: false }
  ];

  nonVegToppings: Topping[] = [
    { name: 'Pepperoni', price: 1.50, selected: false },
    { name: 'Sausage', price: 1.75, selected: false },
    { name: 'Bacon', price: 2.00, selected: false }
  ];

  sizesQty: { [key: string]: number } = {
    Small: 0,
    Medium: 0,
    Large: 0,
    ExtraLarge: 0,
  };

  totalPriceBySize: { [key: string]: number } = {
    Small: 0,
    Medium: 0,
    Large: 0,
    ExtraLarge: 0
  };

  grandTotalPrice: number = 0;

  constructor() {
    for (const size of this.pizzaSizes) {
      this.toppingsMap.set(size.name, [...this.vegToppings, ...this.nonVegToppings].map(topping => ({ ...topping, selected: false })));
    }
  }

  getToppings(sizeName: string): Topping[] {
    return this.toppingsMap.get(sizeName) || [];
  }

  getVegToppings(sizeName: string): Topping[] {
    return this.getToppings(sizeName).filter(topping => this.vegToppings.some(veg => veg.name === topping.name));
  }

  getNonVegToppings(sizeName: string): Topping[] {
    return this.getToppings(sizeName).filter(topping => this.nonVegToppings.some(nonVeg => nonVeg.name === topping.name));
  }

  updatePizzaOrder(size: PizzaSize): void {
    this.calculateTotalPriceForEachSize();
  }

  calculateTotalPriceForEachSize(): void {
    this.grandTotalPrice = 0; // Reset grand total
    for (const size of this.pizzaSizes) {
      this.totalPriceBySize[size.name] = this.calculateSizePrice(size.name);
      this.grandTotalPrice += this.totalPriceBySize[size.name];
    }

    // Apply offers after calculating individual prices
    this.applyOffers();
  }

  calculateSizePrice(sizeName: string): number {
    const quantity = this.sizesQty[sizeName] || 0; // Default to 0 if undefined
    const size = this.pizzaSizes.find(s => s.name === sizeName);
    let price = size ? size.price * quantity : 0;

    const toppings = this.getToppings(sizeName);
    for (const topping of toppings) {
      if (topping.selected) {
        price += topping.price * quantity; // Count topping for each pizza
      }
    }

    return price;
  }

  applyOffers(): void {
    let mediumOfferApplied = false;
    let largeOfferApplied = false;

    // Offer 1: 1 Medium Pizza with 2 toppings = $5 discount
    if (this.sizesQty['Medium'] === 1 && this.countSelectedToppings('Medium') >= 2) {
      this.totalPriceBySize['Medium'] -= 5; // Override to offer price
      mediumOfferApplied = true;
    }

    // Offer 2: 2 Medium Pizzas with 4 toppings each = $10 discount
    if (this.sizesQty['Medium'] >= 2 && this.countSelectedToppings('Medium') >= 4) {
      this.totalPriceBySize['Medium'] -= 9; // Override to offer price
      mediumOfferApplied = true;
    }

    // Offer 3: 1 Large Pizza with 4 toppings = 50% discount
    if (this.sizesQty['Large'] >= 1 && this.countSpecialToppings('Large') >= 4) {
      this.totalPriceBySize['Large'] *= 0.5; // 50% discount
      largeOfferApplied = true;
    }

    // Recalculate grand total after applying offers
    this.grandTotalPrice = Object.values(this.totalPriceBySize).reduce((total, price) => total + price, 0);
  }

  countSelectedToppings(sizeName: string): number {
    const toppings = this.getToppings(sizeName);
    return toppings.filter(topping => topping.selected).length;
  }

  countSpecialToppings(sizeName: string): number {
    const toppings = this.getToppings(sizeName);
    let count = 0;

    for (const topping of toppings) {
      if (topping.selected) {
        count++;
        if (topping.name === 'Pepperoni' || topping.name === 'Sausage') {
          count++; // Count as two for special toppings
        }
      }
    }

    return count;
  }

 }
