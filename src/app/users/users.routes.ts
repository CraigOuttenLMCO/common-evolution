import { ModuleWithProviders} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users.component';
import { AdminUsersComponent } from './admin/admin-users.component'; // andrew
import { UsersFormComponent } from './form/form.component';
import { ViewUsersComponent } from './view-users/view-users.component'; // andrew

const routes: Routes = [{
    path: 'users',
    component: UsersComponent,
    children: [
      {
        /* Andrew: removed original
        path: '',
        component: UsersComponent,
        */
        /* Andrew begin */
        path: '',
        redirectTo: 'all'
        /* Andrew end */
      }, { // andrew
        path: 'all',
        component: ViewUsersComponent,
      }, { // andrew
        path: 'administrators',
        component: ViewUsersComponent,
      }, { // andrew
        path: 'general',
        component: ViewUsersComponent,
      }, { // andrew
        path: 'favorites',
        component: ViewUsersComponent,
      }, { // andrew
        path: 'disabled',
        component: ViewUsersComponent,
      }, {
        path: 'add',
        component: UsersFormComponent,
      }, {
        path: ':id/edit',
        component: UsersFormComponent,
      }/*, { // Testing
        path: ':filter',
        component: UsersComponent,
      }*/
    ],
}];

export const userRoutes: ModuleWithProviders = RouterModule.forChild(routes);
