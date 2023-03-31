import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

//Component that edits existing product or adds a new product
export class AddProductComponent {
  productForm : FormGroup;
  methodologyDataArr = ['Agile', 'Waterfall'];
  developers = [{id: 'dev1', value: '' }, {id: 'dev2', value: '' }, {id: 'dev3', value: '' }, {id: 'dev4', value: '' }, {id: 'dev5', value: '' }];
  //max date for picker
  maxDate = new Date();

  constructor(
    private dialogRef : MatDialogRef<AddProductComponent>,
    private formBuilder : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar : MatSnackBar,
    private productService : ProductService
  ) {
    this.createForm();
    //editing existing product
    if (data?.productId) {
      //iterates through the exisiting product's developers array and assigns it to the corresponding array for the form controls
      data?.Developers.map((dev, idx) => {
        this.developers[idx].value = dev;
      });
      delete data?.Developers;
      //converts the new developers array of objects to object (so we can patch its value for the form)
      let dev = this.developers.reduce((obj, item) => Object.assign(obj, { [item.id]: item.value }), {});
      data = {...data, ...dev};
      //convert string date into date so user is able to view in date picker
      data['startDate'] = new Date(data['startDate']);
      this.productForm.patchValue(data);
      this.productForm.controls['startDate'].disable();
    }
  }

  //creates form for product
  createForm() {
    this.productForm = this.formBuilder.group({
      productName: ['',[Validators.required]],
      productOwnerName: ['',[Validators.required]],
      scrumMasterName: ['',[Validators.required]],
      methodology: ['',[Validators.required]],
      startDate:['', Validators.required],
      dev1: [''],
      dev2: [''],
      dev3: [''],
      dev4: [''],
      dev5: ['']
  })}

  //validates the user input of the Developers input tag
  validateDeveloperUserInput(userInput) {
    //assigns devs based on the user input whose key includes dev and is not empty
    let devs = Object.keys(userInput).filter((key) => key.includes("dev") && userInput[key] != '').reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: userInput[key]
      });
    }, {});
    //user did not enter any input for developers (empty array)
    if (!Object.values(devs).length) {
      this.snackBar.open('The input you have entered is invalid, please enter at least 1 developer.', 'close', {
        duration: 3000
      });
    } 
    return Object.values(devs);
  }

  //closes dialog
  closeDialog() {
    this.dialogRef.close();
  }

  //submits the form
  submitForm() {
    //closes the dialog if the user hasnt changed the values in the ui
    if (this.data && this.productForm.pristine) {
      this.dialogRef.close();
    }
    //invalid values in the form
    if (this.productForm.status != 'VALID') {
      this.snackBar.open('The input you have entered is invalid, please try again.', 'close', {
        duration: 3000
      })
      return;
    //form is valid
    } else {
      let devData = this.validateDeveloperUserInput(this.productForm.value);
      if (devData.length > 0) {
        let body = {};
        this.productForm.controls['startDate'].enable();
        //assigns body to the product form values excluding the formcontrol names that has dev as their key
        body = Object.keys(this.productForm.value).filter((key) => !key.includes("dev")).reduce((obj, key) => {
          return Object.assign(obj, {
            [key]: this.productForm.value[key]
          });
        }, {});
        body["Developers"] = devData;
        //calls the correct function depending whether it is adding or editing
        !this.data ? this.addProduct(body) : this.editProduct(body);
      } else {
        return;
      }
    }
  }

  //adds product and closes the dialog when done
  addProduct(body) {
    this.productService.addProduct(body).subscribe((res) => {
      this.dialogRef.close(res);
    }, err => {
      alert(`${err}. Please try again.`);
    });
  }

  //edits product and closes the dialog when done
  editProduct(body) {
    this.productService.updateProduct(body, this.data.productId).subscribe((res) => {
      this.dialogRef.close(res);
    }, err => {
      alert(`${err}. Please try again.`);
    });
  }
}
