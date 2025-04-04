import { TestBed } from '@angular/core/testing';
import { ProductHelperService } from './product-helper.service';
import { Product } from '../../models/product.mode';

describe('ProductHelperService', () => {
  let service: ProductHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductHelperService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getMinDate', () => {
    it('debería devolver la fecha actual en formato YYYY-MM-DD', () => {
      const fechaEsperada = new Date().toLocaleDateString('en-CA');
      const resultado = service.getMinDate();
      expect(resultado).toBe(fechaEsperada);
    });
  });

  describe('updateDateRevision', () => {
    it('debería devolver una fecha un año después de la fecha de lanzamiento', () => {
      // Product
      const producto: Product = {
        id: '1',
        name: 'Producto de prueba',
        description: 'Descripción de prueba',
        logo: 'https://example.com/logo.png',
        date_release: '2024-03-05',
        date_revision: '', 
      };

      const fechaEsperada = '2025-03-05'; // Un año después

      const resultado = service.updateDateRevision(producto);
      expect(resultado).toBe(fechaEsperada);
    });

    it('debería devolver una cadena vacía si no se proporciona una fecha de lanzamiento', () => {
      const producto: Product = {
        id: '2',
        name: 'Otro producto',
        description: 'Otra descripción',
        logo: 'https://example.com/logo2.png',
        date_release: '', // 
        date_revision: '',
      };

      const resultado = service.updateDateRevision(producto);
      expect(resultado).toBe('');
    });
  });
});
