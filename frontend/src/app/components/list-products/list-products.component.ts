import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})

//Component that lists all the products and filters out products based on user input search and selected filter
export class ListProductsComponent implements OnInit {
  products;
  filterArr = [ { id: 'DEV', name: 'Developer'}, { id: 'SCRUM', name: 'Scrum Master'}]
  selectedFilter = 'DEV';
  search;
  constructor(
    private productService : ProductService,
    private matDialog : MatDialog
  ) { }

  ngOnInit() : void {
    this.getAllProducts()
  }

  //gets all products
  getAllProducts() {
    this.productService.getProducts().subscribe(res =>{
      this.products = res;
    }, err => {
      alert("Unable to get list of products. Please try again.");
    });
  }

  //opens up a dialog for user to edit product
  editProduct(productData) {
    this.matDialog.open(AddProductComponent, {
      data: productData,
      width: '65%',
      height : '80%'
    }).afterClosed().subscribe(res => {
      this.getAllProducts();
    })
  }

  //opens up a dialog for user to add a product
  addProduct() {
    this.matDialog.open(AddProductComponent, {
      width: '65%',
      height : '80%'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.getAllProducts();
      }
    })
  }

  //filters the products based on the search and filter from user input 
  filterProducts() {
    if (this.search && this.selectedFilter) {
      //trim to remove the trailing spaces
      let body = {search : this.search.trim(), filter : this.selectedFilter};
      this.productService.filterProducts(body).subscribe(res => {
        this.products = res;
      }, err => {
        alert(`${err}. Please try again.`);
      });
    }
  }
}
