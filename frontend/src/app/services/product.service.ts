import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  serviceURL : string = 'http://localhost:3000/api';
  
  constructor(private http : HttpClient) { }

  //get products 
  getProducts() {
    return this.http.get(`${this.serviceURL}/products`);
  }

  //add product 
  addProduct(product) {
    return this.http.post(`${this.serviceURL}/products`, product);
  }

  //update product 
  updateProduct(product, id) {
    return this.http.put(`${this.serviceURL}/product/${id}`, product)
  }

  //filter product based on developer or scrum master name 
  filterProducts(data) {
    return this.http.post(`${this.serviceURL}/products/search`, data);
  }
}