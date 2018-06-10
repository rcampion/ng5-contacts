import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './app/home/home.component';
import {AboutComponent} from './app/about/about.component';
import {ContactListComponent} from './app/contact-list/contact-list.component';
import {ContactComponent} from './app/contact/contact.component';
import {GroupListComponent} from './app/group-list/group-list.component';
import {GroupComponent} from './app/group/group.component';
import {LoginComponent} from './app/login/login.component';
import {ErrorComponent} from './app/error/error.component';
import {Users} from './app/users/users';
import {User} from './app/users/user';
import {ParentComponent} from './app/parent/parent.component';
import {SiblingComponent} from './app/sibling/sibling.component';

// Route config let's you map routes to components
const routes: Routes = [
  {path: 'authenticate', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LoginComponent},
  {path: 'users', component: Users, },
  {path: 'user/:id', component: User, },
  {path: '', component: AboutComponent},

  // map '/home' to the home component
  {
    path: 'home',
    component: HomeComponent,
  },
  // map '/about' to the about component
  {
    path: 'about',
    component: AboutComponent,
  },

  // map '/contacts' to the contact list component
  {
    path: 'contacts',
    component: ContactListComponent,
  },
  // map '/contact' to new contact details component
  {
    path: 'contact',
    component: ContactComponent
  },
  // map '/contact/:id' to contact details component
  {
    path: 'contact/:id',
    component: ContactComponent
  },

  // map '/groups' to the group list component
  {
    path: 'groups',
    component: GroupListComponent,
  },
  // map '/group/:id' to group details component
  {
    path: 'group/:id',
    component: GroupComponent
  },
  // map '/group' to group details component
  {
    path: 'group',
    component: GroupComponent
  },
  // map '/error' to error component
  {
    path: 'error',
    component: ErrorComponent
  },

  {
    path: 'parent',
    component: ParentComponent
  },

  {
    path: 'sibling',
    component: SiblingComponent
  }

  /* ,
  // map '/' to '/contacts' as our default route
  {
    path: '',
    redirectTo: '/contacts',
    pathMatch: 'full'
  },*/
];

export const routing = RouterModule.forRoot(routes);
