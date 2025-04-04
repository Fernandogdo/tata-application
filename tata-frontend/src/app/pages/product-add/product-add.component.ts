import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product.mode';
import { ProductService } from '../../services/products-service/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast-service/toast.service';
import { ProductHelperService } from '../../services/product-helper/product-helper.service';

@Component({
  selector: 'app-product-add',
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css',
})
export class ProductAddComponent implements OnInit {
  @Input() id?: string;
  @ViewChild('productForm') productForm!: NgForm;
  formSkeleton = [1, 2, 3, 4, 5, 6];

  loading: boolean = false;
  minDate: string = '';

  product: Product = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService,
    private productHelperService: ProductHelperService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
    this.minDate = this.productHelperService.getMinDate(); 
  }

  //Actualizar o guardar producto
  saveProduct() {
    this.loading = true;
    this.product.date_revision = this.productHelperService.updateDateRevision(this.product);
  
    const request = this.id
      ? this.productService.updateProduct(this.id, this.product)
      : this.productService.addProduct(this.product);
  
    request.subscribe({
      next: (response) => {
        this.toastService.showToast(`✅ ${response.message || 'Operación exitosa'}`);
        this.router.navigate(['/']);
        if (!this.id) this.resetForm();
      },
      error: (error) => {
        this.toastService.showToast(`❌ ${error.error.message || 'Error en la operación'}`);
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
  

  loadProduct() {
    if (this.id) {
      this.loading = true;
      this.productService.getProductById(this.id).subscribe({
        next: (productData) => {
          this.product = { ...productData }; // 📌 Carga los datos en el formulario
          this.loading = false;
        },
        error: () => {
          this.toastService.showToast('❌ Error al cargar el producto.');
          this.loading = false;
        },
      });
    }
  }

  resetForm() {
    this.product = {
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
  
    setTimeout(() => {
      if (this.productForm) {
        this.productForm.resetForm();
      } 
    });
  }
  

  updateDateRevision() {
    this.product.date_revision = this.productHelperService.updateDateRevision(this.product);
  }

  validateReleaseDate() {
    this.updateDateRevision();
    if (this.product.date_release && this.product.date_release < this.minDate) {
      this.product.date_release = this.minDate;
    }
  }
  
}
