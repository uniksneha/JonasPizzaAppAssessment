import { Routes } from '@angular/router';
import { PizzaOrderComponent } from './pizza-order/pizza-order.component';


export const routes: Routes = [
  {
    path: '', 
    redirectTo:'pizza',
    pathMatch: 'full' 
    
  },
{
  path:'pizza',
  component:PizzaOrderComponent,
  
},

];
