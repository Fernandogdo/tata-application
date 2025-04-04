import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../../models/product.mode';
import { environment } from '../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products from API', () => {
    const mockProducts: { data: Product[] } = {
      data: [
        { id: '1', name: 'Producto 1', description: 'Desc 1', logo: 'logo1.png', date_release: '2025-01-01', date_revision: '2025-02-01' },
        { id: '2', name: 'Producto 2', description: 'Desc 2', logo: 'logo2.png', date_release: '2025-03-01', date_revision: '2025-04-01' },
      ],
    };

    service.getProducts().subscribe((response) => {
      expect(response).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should fetch a single product by ID', () => {
    const mockProduct: Product = { id: '1', name: 'Producto 1', description: 'Desc 1', logo: 'logo1.png', date_release: '2025-01-01', date_revision: '2025-02-01' };

    service.getProductById('1').subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should add a new product', () => {
    const newProduct: Product = { id: '3', name: 'Nuevo Producto', description: 'Nuevo Desc', logo: 'logo3.png', date_release: '2025-05-01', date_revision: '2025-06-01' };

    service.addProduct(newProduct).subscribe((response) => {
      expect(response).toEqual(newProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update an existing product', () => {
    const updatedProduct: Partial<Product> = { name: 'Producto Modificado' };

    service.updateProduct('1', updatedProduct).subscribe((response) => {
      expect(response).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct('1').subscribe((response) => {
      expect(response).toEqual({ message: 'Producto eliminado' });
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Producto eliminado' });
  });
});
