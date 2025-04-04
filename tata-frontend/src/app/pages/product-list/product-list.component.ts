import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/products-service/product.service';
import { Product } from '../../models/product.mode';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast-service/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginationOptions = [5, 10, 20];

  loading = true;
  searchText = '';
  limit = 5;
  selectedProductId: string | null = null;
  nameProductDelete: string | null = null;
  showDeleteModal: boolean = false;
  dropdownOpen: string | null = null;

  constructor(
    private productService: ProductService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  //Carga productos
  loadProducts() {
    this.loading = true; 
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.data;
        this.filteredProducts = products.data;
        this.loading = false;      
      },
      error: (error) => {
        console.log('🚀 Error cargando productos:', error);
        this.loading = false;
      },
    });
  }

  // Buscar productos en tiempo real
  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
     
      return Object.values(product).some((value) =>
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  toggleDropdown(productId: string) {
    this.dropdownOpen = this.dropdownOpen === productId ? null : productId;
  }

  editProduct(productId: string) {
    this.router.navigate(['/product-add', productId]); 
  }

  openDeleteModal(productId: string) {
    this.selectedProductId = productId;
    this.showDeleteModal = true;

    const productToDelete = this.filteredProducts.find(
      (product) => product.id === this.selectedProductId
    );

    if (productToDelete) {
      this.nameProductDelete = productToDelete.name; 
    }
  }

  confirmDelete() {
    if (this.selectedProductId) {
      console.log(
        '🚀 ~ ProductListComponent ~ confirmDelete ~ this.selectedProductId:',
        this.selectedProductId
      );
      this.productService
        .deleteProduct(this.selectedProductId)
        .subscribe({
          next: (response) => {
              this.loadProducts(); 
              this.showDeleteModal = false;
              this.selectedProductId = null; 
              this.toastService.showToast('✅ ' + response.message);
          },
          error: (error) => {
            this.toastService.showToast('❌ Error: ' + error.error.message);
          }
        });
    }
  }
}
