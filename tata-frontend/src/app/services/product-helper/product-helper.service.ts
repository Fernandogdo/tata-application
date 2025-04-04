import { Injectable } from '@angular/core';
import { Product } from '../../models/product.mode';

@Injectable({
  providedIn: 'root',
})
export class ProductHelperService {
 
  getMinDate(): string {
    return new Date().toLocaleDateString('en-CA');
  }

  updateDateRevision(product: Product): string {
    if (product.date_release) {
      const releaseDate = new Date(product.date_release);
      releaseDate.setFullYear(releaseDate.getFullYear() + 1);
      return releaseDate.toISOString().split('T')[0];
    }
    return '';
  }
}
