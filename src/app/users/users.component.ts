import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdMediaService } from '@covalent/core/media';

import { UserService, IUser } from './services/user.service';

import 'rxjs/add/operator/toPromise';

// andrew
import { Router, ActivatedRoute, NavigationStart, RoutesRecognized, ActivationEnd, NavigationEnd, ResolveEnd, ChildActivationEnd } from '@angular/router';

@Component({
  selector: 'ce-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  //users: IUser[];
  //filteredUsers: IUser[];

  //filterAdmins:boolean = false; // andrew
  //filterGeneralUsers:boolean = false; // andrew
  //filterFavoriteUsers:boolean = false; // andrew
  //filterDisabledUsers:boolean = false; // andrew

  title:string = 'All Users'; // andrew
  //view: string; // andrew

  constructor(private _route: ActivatedRoute, // andrew
              private _router: Router,
              private _titleService: Title,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _snackBarService: MatSnackBar,
              private _userService: UserService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
                
    // andrew begin (is there a better way?)
    
    /*
    _router.events
      //.filter(event => event instanceof NavigationStart)
      .subscribe((event) => {
        //console.log('Route Event: ' + event);
        //console.log(event);

        //if (event instanceof ActivationEnd) {
        //  console.log('ActivationEnd Event:');
        //  console.log(event);
        //}

        //if (event instanceof NavigationStart) {
        //  console.log('NavigationStart: ' + event);
        //}

        //if (event instanceof RoutesRecognized) {
        //  console.log('RoutesRecognized: ' + event);
        //}

        // andrew: TODO can we get the title from the child component?
        // andrew: Add view and title information to a service (user service?)
        if (event instanceof NavigationEnd) {
          //console.log('NavigationEnd:');
          //console.log(event);
          //var url:string = event.url;

          if (event.url) {
            if (event.url.indexOf('/administrators') > 0) {
              this.title = 'Administrators';
              this.view = 'administrators';
            } else if (event.url.indexOf('general') > 0) {
              this.title = 'Non-Admins';
              this.view = 'general';
            } else if (event.url.indexOf('favorites') > 0) {
              this.title = 'Favorites';
              this.view = 'favorites';
            } else if (event.url.indexOf('disabled') > 0) {
              this.title = 'Disabled';
              this.view = 'disabled';
            } else {
              this.view = 'all';
              this.title = 'All Users';
            }
          }
        }

        //if (event instanceof ResolveEnd) {
        //  console.log('ResolveEnd:');
        //  console.log(event);
        //}

        //if (event instanceof ChildActivationEnd) {
        //  console.log('ChildActivationEnd:');
        //  console.log(event);

        //  if (event.snapshot.component instanceof UsersComponent) {

        //  }
        //}
    });
    */

    //console.log(_route);
    //console.log(_route.snapshot);

    /*this.view = _route.snapshot.routeConfig.path;

    //if ((this.view == 'all') || (_route.snapshot.params['filter'] == 'all')) {
    //  this.title = 'All Users';
    //}

    console.log('View: ' + this.view);

    if ((this.view == 'administrators') || (_route.snapshot.params['filter'] == 'administrators')) {
      //this.filterAdmins = true;
      this.title = 'Administrators';
    }

    if ((this.view == 'general') || (_route.snapshot.params['filter'] == 'general')) {
      //this.filterGeneralUsers = true;
      this.title = 'Non-Admins';
    }

    if (this.view == 'favorites') {
      //this.filterFavoriteUsers = true;
      this.title = 'Favorites';
    }

    if ((this.view == 'disabled') || (_route.snapshot.params['filter'] == 'disabled')) {
      //this.filterDisabledUsers = true;
      this.title = 'Disabled';
    }
    */
    
    // New router-outlet code
    //console.log(_route.firstChild.routeConfig.path);
    //var url:string = _route.snapshot._routerState.url;
    /*
    this.view = _route.firstChild ? _route.firstChild.routeConfig.path : _route.snapshot.routeConfig.path;
    console.log('View: ' + this.view);

    if (this.view == 'administrators') {
      this.title = 'Administrators';
    } else if (this.view == 'general') {
      this.title = 'Non-Admins';
    } else if (this.view == 'favorites') {
      this.title = 'Favorites';
    } else if (this.view == 'disabled') {
      this.title = 'Disabled';
    } else {
      this.view = 'all';
      this.title = 'All Users'
    }
    */

    //if( test.indexOf('World') >= 0){
    // andrew end
  }

  ngOnInit(): void {
    //this._titleService.setTitle('Common-Evolution Users');
    //this.load();
  }

  /* andrew: removed original
  filterUsers(displayName: string = ''): void {
    if (this.users) { // andrew
      this.filteredUsers = this.users.filter((user: IUser) => {
        return user.displayName.toLowerCase().indexOf(displayName.toLowerCase()) > -1;
      });
    }
  }
  */
  
  /* andrew: removed original
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
  */
  
  /* andrew: removed original
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
  */

  /**
   * When the cild component activates, retireve the title from it
   * Helpful hint: https://stackoverflow.com/questions/45949476/how-to-call-router-outlet-child-component-method-from-parent-comonent
   * 
   * @param childComponent the child component reference
   */
  onChildActivate(childComponent):void {
    //console.log(componentRef);
    //this.view = childComponent.view;
    this.title = childComponent.title;
  }
}
