import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { TdMediaService } from '@covalent/core/media';

import { AlertsService } from '../../services';

@Component({
  selector: 'ce-dashboard-product',
  templateUrl: './dashboard-product.component.html',
  styleUrls: ['./dashboard-product.component.scss'],
  viewProviders: [ AlertsService ],
})
export class DashboardProductComponent implements OnInit {

  title: string;
  alerts: Object[] = []; // andrew (change name? notifications?)

  constructor(private _titleService: Title,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService,
              private _alertsService: AlertsService) { }

  ngOnInit(): void {
    this._titleService.setTitle( 'Product Dashboard' );
    this.title = this._titleService.getTitle();

    // andrew
    //this._loadingService.register('alerts.load');
    this._alertsService.query().subscribe((alerts: Object[]) => {
      this.alerts = alerts;
      //setTimeout(() => {
        //this._loadingService.resolve('alerts.load');
      //}, 750);
    });
  }
}
