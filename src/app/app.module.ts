import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user-list/user/user.component';
import { NewUserFormComponent } from './user-list/new-user-form/new-user-form.component';
import { NgLetDirective } from './directives/ng-let.directive';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, UserListComponent, UserComponent, NewUserFormComponent, NgLetDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
