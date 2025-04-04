import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductAddComponent } from './pages/product-add/product-add.component';

export const routes: Routes = [
    {path: '', component: ProductListComponent},
    {path: 'product-add', component: ProductAddComponent},
    {path: 'product-add/:id', component: ProductAddComponent}
];
