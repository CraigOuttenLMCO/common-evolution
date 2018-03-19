import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';

import { UserService, IUser } from '../services/user.service';

import 'rxjs/add/operator/toPromise';

// andrew
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ce-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
})
export class ViewUsersComponent implements OnInit {

  users: IUser[];
  filteredUsers: IUser[];

  filterAdmins:boolean = false; // andrew
  filterGeneralUsers:boolean = false; // andrew
  filterFavoriteUsers:boolean = false; // andrew
  filterDisabledUsers:boolean = false; // andrew

  // hold the view: administrators, general, favorites, disabled
  view: string = 'all'; // andrew
  title: string = 'All Users'; // andrew

  constructor(private _route: ActivatedRoute, // andrew
              private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _snackBarService: MatSnackBar,
              private _userService: UserService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
    this.view = _route.snapshot.routeConfig.path;

    if ((this.view == 'administrators') /*|| (_route.snapshot.params['filter'] == 'administrators')*/) {
      this.filterAdmins = true;
      this.title = 'Administrators';
    } else if ((this.view == 'general') /*|| (_route.snapshot.params['filter'] == 'general')*/) {
      this.filterGeneralUsers = true;
      this.title = 'Non-Admins';
    } else if (this.view == 'favorites') {
      this.filterFavoriteUsers = true;
      this.title = 'Favorites';
    } else if ((this.view == 'disabled') /*|| (_route.snapshot.params['filter'] == 'disabled')*/) {
      this.filterDisabledUsers = true;
      this.title = 'Disabled';
    } else {
      this.view = 'all';
      this.title = 'All Users';
    }
  }

  ngOnInit(): void {
    this._titleService.setTitle('Common-Evolution View Users');
    this.load();
  }

  filterUsers(displayName: string = ''): void {
    if (this.users) { // andrew
      this.filteredUsers = this.users.filter((user: IUser) => {
        return user.displayName.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
      });
    }
  }

  async load(): Promise<void> {
    try {
      this._loadingService.register('users.list');
      this.users = await this._userService.query().toPromise();
      // andrew begin
      if (this.filterAdmins) {
        this.users = this.users.filter((user: IUser) => {
          return (user.siteAdmin === 1);
        });
      } else if (this.filterGeneralUsers) {
        this.users = this.users.filter((user: IUser) => {
          return (user.siteAdmin === 0);
        });
      }
      else if (this.filterFavoriteUsers) {
        this.users = this.users.filter((user: IUser) => {
          return (user.favorite === 1);
        });
      }
      else if (this.filterDisabledUsers) {
        this.users = this.users.filter((user: IUser) => {
          //console.log('disabled filter: ' + JSON.stringify(user));
          return (user.disabled == true);
        });
      }
      // andrew end
    } catch (error) {
      this.users = await this._userService.staticQuery().toPromise();
    } finally {
      this.filteredUsers = Object.assign([], this.users);
      this._loadingService.resolve('users.list');
    }
  }

  delete(id: string): void {
    this._dialogService
      .openConfirm({message: 'Are you sure you want to delete this user?'})
      .afterClosed().toPromise().then((confirm: boolean) => {
        if (confirm) {
          this._delete(id);
        }
      });
  }

  private async _delete(id: string): Promise<void> {
    try {
      this._loadingService.register('users.list');
      await this._userService.delete(id).toPromise();
      this.users = this.users.filter((user: IUser) => {
        return user.id !== id;
      });
      this.filteredUsers = this.filteredUsers.filter((user: IUser) => {
        return user.id !== id;
      });
      this._snackBarService.open('User Deleted', 'Ok');
    } catch (error) {
      this._dialogService.openAlert({message: 'There was an error trying to delete the user'});
    } finally {
      this._loadingService.resolve('users.list');
    }
  }

}
