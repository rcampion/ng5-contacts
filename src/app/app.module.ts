import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, XHRBackend, RequestOptions, HttpModule, ConnectionBackend} from '@angular/http';
import {routing} from '../app.routes';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {ContactComponent} from './contact/contact.component';
import {ContactListComponent} from './contact-list/contact-list.component';
import {GroupComponent} from './group/group.component';
import {GroupListComponent} from './group-list/group-list.component';
import {GroupMembersComponent} from './group-members/group-members.component';
import {GroupMemberSelectorComponent} from './group-member-selector/group-member-selector.component';
import {Users} from './users/users';
import {User} from './users/user';
import {ErrorComponent} from './error/error.component';
import {LoginService} from '../services/login.service';
import {AccountEventsService} from '../services/account.events.service';
import {ErrorService} from '../services/error.service';
import {UtilsModule} from '../app/utils/utils.module';
import {HmacHttpClient} from '../app/utils/hmac-http-client';
import {AppComponent} from './app.component';
import {ParentComponent} from './parent/parent.component';
import {SiblingComponent} from './sibling/sibling.component';
import {IsAuthorizedDirective} from '../app/utils/is-authorized.directive';
import {TableSortComponent} from './table-sort/table-sort.component';
import {TablePaginationComponent} from './table-pagination/table-pagination.component';

import {TableElementsCountComponent} from './table-elements-count/table-elements-count.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    LoginComponent,
    ErrorComponent,
    ContactComponent,
    ContactListComponent,
    GroupComponent,
    GroupListComponent,
    GroupMembersComponent,
    GroupMemberSelectorComponent,
    Users,
    User,
    ParentComponent,
    SiblingComponent,
    TableSortComponent,
    TablePaginationComponent,
    TableElementsCountComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    UtilsModule
  ],
  providers: [
    LoginService, AccountEventsService, Http, ErrorService,
    {
      provide: Http,
      useFactory: hmacHttpClient,
      deps: [XHRBackend, RequestOptions, AccountEventsService, ErrorService, Router],
      multi: false
    }],

  bootstrap: [AppComponent, ErrorComponent]
})
export class AppModule {}

export function hmacHttpClient(xhrBackend: XHRBackend, requestOptions: RequestOptions, accountEventService: AccountEventsService, errorService: ErrorService, router: Router) {
  return new HmacHttpClient(xhrBackend, requestOptions, accountEventService, errorService, router);
};

