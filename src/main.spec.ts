import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { connection } from 'mongoose';

describe('API Flow Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let vendorId: string;
  let productId: string;
  let cartId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await app.close();
  });

  describe('Authentication Flow', () => {
    const userCredentials = {
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };

    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(userCredentials)
        .expect(201)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty('_id');
          userId = body.data._id;
        });
    });

    it('should login and get tokens', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty('accessToken');
          expect(body.data).toHaveProperty('refreshToken');
          accessToken = body.data.accessToken;
          refreshToken = body.data.refreshToken;
        });
    });

    it('should refresh tokens', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty('accessToken');
          expect(body.data).toHaveProperty('refreshToken');
          accessToken = body.data.accessToken;
          refreshToken = body.data.refreshToken;
        });
    });
  });

  describe('Vendor Flow', () => {
    const vendorData = {
      companyName: 'Test Company',
      businessEmail: 'vendor@test.com',
      password: 'Vendor123!',
      address: 'Test Address',
      contactNumber: '1234567890'
    };

    it('should register a vendor', () => {
      return request(app.getHttpServer())
        .post('/vendors/register')
        .send(vendorData)
        .expect(201)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty('_id');
          vendorId = body.data._id;
        });
    });

    it('should get vendor details', () => {
      return request(app.getHttpServer())
        .get(`/vendors/${vendorId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
  /*
    describe('Product Flow', () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 100,
        categories: ['test'],
        images: ['http://test.com/image.jpg']
      };
  
      it('should create a product', () => {
        return request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...productData, vendorId })
          .expect(201)
          .expect(({ body }) => {
            expect(body.data).toHaveProperty('_id');
            productId = body.data._id;
          });
      });
  
      it('should get all products', () => {
        return request(app.getHttpServer())
          .get('/products')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect(({ body }) => {
            expect(body.data).toBeInstanceOf(Array);
          });
      });
  
      it('should get product by id', () => {
        return request(app.getHttpServer())
          .get(`/products/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
      });
  
      it('should update product', () => {
        return request(app.getHttpServer())
          .put(`/products/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ price: 89.99 })
          .expect(200);
      });
    });
  
    describe('Cart Flow', () => {
      it('should add item to cart', () => {
        return request(app.getHttpServer())
          .post('/cart/items')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            productId,
            quantity: 2
          })
          .expect(201)
          .expect(({ body }) => {
            expect(body.data).toHaveProperty('_id');
            cartId = body.data._id;
          });
      });
  
      it('should get cart', () => {
        return request(app.getHttpServer())
          .get('/cart')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect(({ body }) => {
            expect(body.data.items).toBeInstanceOf(Array);
          });
      });
  
      it('should remove item from cart', () => {
        return request(app.getHttpServer())
          .delete(`/cart/items/${productId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
      });
    });
  
    describe('Error Cases', () => {
      it('should fail with invalid token', () => {
        return request(app.getHttpServer())
          .get('/products')
          .set('Authorization', 'Bearer invalid_token')
          .expect(401);
      });
  
      it('should fail to create product with invalid data', () => {
        return request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'Invalid Product' }) // Missing required fields
          .expect(400);
      });
  
      it('should fail to access non-existent product', () => {
        return request(app.getHttpServer())
          .get('/products/000000000000000000000000')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);
      });
    });*/
});