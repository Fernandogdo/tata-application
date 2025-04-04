import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/products-service/product.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: any;
  let toastServiceMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of({
        data: [
          { id: '1', name: 'Producto 1', description: 'Desc 1', logo: 'logo1.png', date_release: '2025-01-01', date_revision: '2025-02-01' },
          { id: '2', name: 'Producto 2', description: 'Desc 2', logo: 'logo2.png', date_release: '2025-03-01', date_revision: '2025-04-01' }
        ]
      })),
      deleteProduct: jest.fn().mockReturnValue(of({ message: 'Producto eliminado' })),
    };

    toastServiceMock = {
      showToast: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ProductService, useValue: productServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar los productos correctamente', () => {
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(productServiceMock.getProducts).toHaveBeenCalled();
  });

  
});
