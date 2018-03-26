import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select'; // andrew (added for form.component)

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentSearchModule } from '@covalent/core/search';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentMediaModule } from '@covalent/core/media';
import { CovalentLoadingModule } from '@covalent/core/loading';
//import { CovalentVirtualScrollModule } from '@covalent/core/virtual-scroll'; // andrew
import { CovalentDataTableModule } from '@covalent/core/data-table'; // andrew

import { UsersComponent } from './users.component';
import { AdminUsersComponent } from './admin/admin-users.component'; // andrew
import { ViewUsersComponent } from './view-users/view-users.component'; // andrew
import { UsersFormComponent } from './form/form.component';
import { PluralPipe } from '../../pipes/plural.pipe'; // andrew

import { userRoutes } from './users.routes';

import { UserService, IUser, USER_PROVIDER, USERS_API } from './services/user.service';

export { UsersComponent, AdminUsersComponent, UsersFormComponent, UserService, IUser, USER_PROVIDER, USERS_API };

@NgModule({
  declarations: [
    UsersComponent,
    AdminUsersComponent, // andrew
    UsersFormComponent,
    ViewUsersComponent, // andrew
    PluralPipe, // andrew
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    // angular modules
    CommonModule,
    FormsModule,
    RouterModule,
    // material modules
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSelectModule, // andrew
    // covalent modules
    CovalentLoadingModule,
    CovalentDialogsModule,
    CovalentMediaModule,
    CovalentLayoutModule,
    CovalentSearchModule,
    CovalentCommonModule,
    //CovalentVirtualScrollModule, // andrew
    CovalentDataTableModule,
    // extra
    userRoutes,
  ], // modules needed to run this module
  providers: [
    { provide: USERS_API, useValue: ''},
    USER_PROVIDER,
  ],
})
export class UsersModule {}
