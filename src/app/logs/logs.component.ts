import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TdLoadingService } from '@covalent/core/loading';
import { TdMediaService } from '@covalent/core/media';

import { ItemsService, ProductsService } from '../../services';

// andrew begin
import { IProduct } from '../../services/products.service';
// andrew end

@Component({
  selector: 'ce-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  viewProviders: [ ItemsService, ProductsService ],
})
export class LogsComponent implements OnInit {

  items: Object[];
  //products: Object[]; // andrew: original
  products: IProduct[];

  // andrew begin
  filteredProducts: Object[];
  // andrew end

  constructor(private _titleService: Title,
              private _itemsService: ItemsService,
              private _productsService: ProductsService,
              private _loadingService: TdLoadingService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {

  }

  ngOnInit(): void {
    this._titleService.setTitle('Common-Evolution Logs');

    this._loadingService.register('items.load');
    this._itemsService.query().subscribe((items: Object[]) => {
      this.items = items;
      setTimeout(() => {
        this._loadingService.resolve('items.load');
      }, 2000);
    }, (error: Error) => {
      this._itemsService.staticQuery().subscribe((items: Object[]) => {
        this.items = items;
        setTimeout(() => {
          this._loadingService.resolve('items.load');
        }, 2000);
      });
    });
    this._loadingService.register('products.load');
    //this._productsService.query().subscribe((products: Object[]) => { // andrew: original
    this._productsService.query().subscribe((products: IProduct[]) => {
      this.products = products;
      setTimeout(() => {
        this._loadingService.resolve('products.load');
      }, 2000);
      // andrew begin
      this.filteredProducts = Object.assign([], this.products);
      // andrew end
    });
  }
  // andrew begin
  filterProducts(displayName: string = ''): void {
    if (this.products) { // andrew
      //this.filteredProducts = this.products.filter((product: Object) => { // andrew: original
      this.filteredProducts = this.products.filter((product: IProduct) => {
        return product.name.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
      });
    }
  }
  // andrew end
}
