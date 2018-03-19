import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select'; // andrew (did I add this?)

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { UserService, IUser } from '../services/user.service';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'ce-user-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class UsersFormComponent implements OnInit {

  displayName: string;
  email: string;
  id: string;
  admin: boolean;
  disabled: boolean;
  user: IUser;
  action: string;

  // andrew
  backView: string;
  groupMembership: string[];
  groupList:string[] = ['Admin', 'General', 'Home', 'Work', 'Technician', 'Intern'];

  constructor(private _userService: UserService,
              private _router: Router,
              private _route: ActivatedRoute,
              private _snackBarService: MatSnackBar,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService) {
    //console.log(_route.snapshot);

    // andrew begin test
    /*
    _router.events
      .subscribe((event) => {
        console.log('Route Event: ' + event);

        //if (event instanceof ActivationEnd) {
        //}
        //if (event instanceof NavigationEnd) {
        //  console.log('Navigation end URL: ' + event.url);
        //}
      });
    */
    // andrew end test

    // andrew begin
    //let view: string = _route.snapshot.queryParams['view'];
    
    this._route.queryParams.subscribe((params) => {
      if (params.view) {
        this.backView = params.view;
        //console.log('Back View specified: ' + this.backView);
      } else {
        this.backView = 'all'; // default view
      }
    });
    /*
    this._route.snapshot.queryParams.subscribe((params) => {
      if (params.view) {
        this.backView = params.view;
      } else {
        this.backView = 'all'; // default view
      }
    });

    if (view) {
      //console.log('View: ' + view);
      this.backView = view;
    } else {
      this.backView = 'all';
    }
    */
    // andrew end
  }

  goBack(): void {
    this._router.navigate(['/users', this.backView]);
  }

  ngOnInit(): void {
    this._route.url.subscribe((url: any) => {
      this.action = (url.length > 1 ? url[1].path : 'add');
    });
    this._route.params.subscribe((params: {id: string}) => {
      this.id = params.id;
      if (this.id) {
        this.load();
      }
    });
  }

  async load(): Promise<void> {
    try {
      this._loadingService.register('user.form');
      let user: IUser = await this._userService.get(this.id).toPromise();
      this.displayName = user.displayName;
      this.email = user.email;
      this.admin = (user.siteAdmin === 1 ? true : false);
      this.disabled = user.disabled;
    } catch (error) {
      this._dialogService.openAlert({message: 'There was an error loading the user'});
    } finally {
      this._loadingService.resolve('user.form');
    }
  }

  async save(): Promise<void> {
    try {
      this._loadingService.register('user.form');
      let siteAdmin: number = (this.admin ? 1 : 0);
      let now: Date = new Date();
      this.user = {
        displayName: this.displayName,
        email: this.email,
        siteAdmin: siteAdmin,
        id: this.id || this.displayName.replace(/\s+/g, '.'),
        created: now,
        lastAccess: now,
        disabled: this.disabled,
        favorite: 0 // TODO: Andrew finish this (...or not)
      };
      if (this.action === 'add') {
        await this._userService.create(this.user).toPromise();
      } else {
        await this._userService.update(this.id, this.user).toPromise();
      }
      this._snackBarService.open('User Saved', 'Ok');
      this.goBack();
    } catch (error) {
      this._dialogService.openAlert({message: 'There was an error saving the user'});
    } finally {
      this._loadingService.resolve('user.form');
    }
  }
}
