import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';

interface ProductData {
  Name: string;
  Age: number;
  Addres: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  productList = [];
  productData: ProductData;
  productForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder
  ) {
    this.productData = {} as ProductData;
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      Name: ['', [Validators.required]],
      Age: ['', [Validators.required]],
      Address: ['', [Validators.required]],
    });

    this.firebaseService.read_products().subscribe((data) => {
      this.productList = data.map((e) => {
        return {
          id: e.payload.doc['id'],
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Age: e.payload.doc.data()['Age'],
          Address: e.payload.doc.data()['Address'],
        };
      });
    });
  }

  CreateRecord() {
    this.firebaseService.create_product(this.productForm.value).then((resp) => {
      //Reset form
      this.productForm.reset();
    });
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_product(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Age;
    record.EditAddress = record.Address;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Age'] = recordRow.EditAge;
    record['Address'] = recordRow.EditAddress;
    this.firebaseService.update_product(recordRow.id, record);
    recordRow.isEdit = false;
  }
}
