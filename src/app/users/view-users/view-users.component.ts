import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';

import { UserService, IUser } from '../services/user.service';

import 'rxjs/add/operator/toPromise';

// andrew begin
import { ActivatedRoute } from '@angular/router';
import { ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableSortingOrder, TdDataTableService } from '@covalent/core/data-table';
import { PluralPipe } from '../../../pipes/plural.pipe';
// andrew end

@Component({
  selector: 'ce-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
})
export class ViewUsersComponent implements OnInit {

  users: IUser[] = [];
  filteredUsers: IUser[] = [];

  filterAdmins:boolean = false; // andrew
  filterGeneralUsers:boolean = false; // andrew
  filterFavoriteUsers:boolean = false; // andrew
  filterDisabledUsers:boolean = false; // andrew
  // andrew begin
  private columns: ITdDataTableColumn[] = [
    { name: 'displayName', label: 'User Name', tooltip: 'User name', sortable: true },
    { name: 'created', label: 'Created', width: 200, sortable: true },
    { name: 'lastAccess', label: 'Last Accessed', width: 200, sortable: true },
    { name: 'email', label: 'Email', sortable: true, width: 250 },
    { name: 'groups', label: 'Groups', width: 100, sortable: false },
    { name: 'actions', label: 'Actions', width: 100, sortable: false }
  ];
  // andrew end

  // hold the view: administrators, general, favorites, disabled
  // andrew begin
  view: string = 'all'; // andrew
  title: string = 'All Users'; // andrew

  selectable: boolean = true;
  clickable: boolean = true;
  multiple: boolean = true;
  searchTerm: string = '';
  sortBy: string = 'displayName';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  selectedRows: IUser[] = [];

  showOriginal: boolean = false;
  showTest1: boolean = false;
  showTest2: boolean = true;
  // andrew end

  constructor(private _route: ActivatedRoute, // andrew
              private _dataTableService: TdDataTableService, // andrew
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
    if (this.users) { // andrew: added this conditional check
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
      //this.filteredUsers = Object.assign([], this.users);
      this.filter(); // andrew
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

  /* andrew begin */
  enableSelectedUsers(): void {
    // TODO: Implement
    console.log('TODO: implement enableSelectedUsers');
  }

  disableSelectedUsers(): void {
    // TODO: Implement
    console.log('TODO: implement disableSelectedUsers');
  }

  deleteSelectedUsers(): void {
    // TODO: Implement
    console.log('TODO: implement deleteSelectedUsers');
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    //console.log('Sort by name: ' + sortEvent.name);
    this.sortOrder = sortEvent.order;
    //console.log('Sort order: ' + sortEvent.order);
    this.filter();
  }

  private filter(): void {
    //console.log('Filter function called');

    //let newData: IUser[] = this.data;
    let newData: IUser[] = this.users;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });

    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    //this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    //newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    //this.filteredData = newData;

    this.filteredUsers = newData;
  }

  editUserGroups(userId: string): void {
    // TODO: Implement me
    console.log('TODO: implement edit user groups for user ID ' + userId);
  }
  /* andrew end */
}
