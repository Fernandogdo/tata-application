import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductAddComponent } from './product-add.component';
import { ProductService } from '../../services/products-service/product.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { ProductHelperService } from '../../services/product-helper/product-helper.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';


describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fixture: ComponentFixture<ProductAddComponent>;
  let productServiceMock: any;
  let toastServiceMock: any;
  let productHelperServiceMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProductById: jest.fn().mockReturnValue(of({
        id: '1',
        name: 'Producto de prueba',
        description: 'Descripción de prueba',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2025-01-01',
        date_revision: '2025-02-01',
      })),
      addProduct: jest.fn().mockReturnValue(of({ message: 'Producto agregado exitosamente' })),
      updateProduct: jest.fn().mockReturnValue(of({ message: 'Producto actualizado correctamente' })),
    };

    toastServiceMock = {
      showToast: jest.fn(),
    };

    productHelperServiceMock = {
      getMinDate: jest.fn().mockReturnValue('2024-10-01'),
      updateDateRevision: jest.fn().mockReturnValue('2025-02-01'),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule], // ✅ Eliminamos RouterTestingModule
      providers: [
        provideRouter([]), // ✅ Nueva forma de proveer el router en Angular 19
        { provide: ProductService, useValue: productServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ProductHelperService, useValue: productHelperServiceMock },
      ],
    }).compileComponents();
    

    fixture = TestBed.createComponent(ProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('debería cargar un producto si hay un ID', () => {
    component.id = '1';
    component.loadProduct();
  
    fixture.detectChanges();
  
    expect(productServiceMock.getProductById).toHaveBeenCalledWith('1');
    expect(component.product.name).toBe('Producto de prueba');
  });

  it('debería iniciar con un formulario vacío si no hay ID', () => {
    expect(component.product.id).toBe('');
    expect(component.product.name).toBe('');
    expect(component.product.description).toBe('');
  });
  
  it('debería ser inválido si el ID tiene menos de 3 caracteres', () => {
    component.product.id = 'AB';
    fixture.detectChanges();
    
    const idInput = fixture.nativeElement.querySelector('#id');
    idInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  
    expect(idInput.classList).toContain('ng-invalid');
  });

  it('debería ser inválido si el nombre es demasiado corto', () => {
    component.product.name = 'AB';
    fixture.detectChanges();
  
    const nameInput = fixture.nativeElement.querySelector('#name');
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  
    expect(nameInput.classList).toContain('ng-invalid');
  });
  
  // it('debería llamar a addProduct cuando no hay ID', () => {
  //   component.id = undefined;
  //   component.product = {
  //     id: 'veinte',
  //     name: 'Nuevo Producto',
  //     description: 'Descripción del producto',
  //     logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
  //     date_release: '2025-01-01',
  //     date_revision: '2025-02-01',
  //   };
  
  //   component.saveProduct();
  //   expect(productServiceMock.addProduct).toHaveBeenCalledWith(component.product);
  //   expect(toastServiceMock.showToast).toHaveBeenCalledWith('✅ Producto agregado exitosamente');
  // });

  it('debería llamar a updateProduct cuando hay ID', () => {
    component.id = 'tres';
    component.product = {
      id: 'tres',
      name: 'Producto Actualizado',
      description: 'Descripción actualizada',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2025-01-01',
      date_revision: '2025-02-01',
    };
  
    component.saveProduct();
    expect(productServiceMock.updateProduct).toHaveBeenCalledWith('tres', component.product);
    expect(toastServiceMock.showToast).toHaveBeenCalledWith('✅ Producto actualizado correctamente');
  });
  
  it('debería limpiar el formulario al hacer clic en "Reiniciar"', () => {
    component.product = {
      id: '1',
      name: 'Producto Prueba',
      description: 'Descripción',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2025-01-01',
      date_revision: '2025-02-01',
    };
  
    component.resetForm();
    expect(component.product.id).toBe('');
    expect(component.product.name).toBe('');
    expect(component.product.description).toBe('');
  });

  it('debería corregir la fecha de liberación si es menor a la mínima permitida', () => {
    component.minDate = '2024-10-01';
    component.product.date_release = '2024-09-30';
  
    component.validateReleaseDate();
    expect(component.product.date_release).toBe('2024-10-01');
  });
  
  
});
