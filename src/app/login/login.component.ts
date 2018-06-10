import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Account } from '../../models/account';
import { AccountEventsService } from '../../services/account.events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent {
  username: string;
  password: string;
  router: Router;
  wrongCredentials: boolean;
  loginForm: FormGroup;
  loginService: LoginService;
  account: Account;
  error: string;

  constructor(router: Router, form: FormBuilder, loginService: LoginService, accountEventService: AccountEventsService) {
    this.router = router;
    this.wrongCredentials = false;
    this.loginService = loginService;
    this.loginForm = form.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    accountEventService.subscribe((account) => {
      if (!account.authenticated) {
        if (account.error) {
          if (account.error.indexOf('Unauthorized') !== -1) {
            this.error = 'Username and/or password are invalid !';
            // this.account.authenticated = false;
          } else {
            this.error = account.error;
          }
        }
      }
    },
      (error: any) => {
        console.log('Username and/or password are invalid !');
        this.error = 'Username and/or password are invalid !';
      });
  }

  authenticate(event) {
    event.preventDefault();
    try {
      this.loginService.authenticate(this.loginForm.value.username, this.loginForm.value.password)

        .subscribe(account => {
          this.account = account;
          console.log('Successfully logged in.', account);
          this.account.authenticated = true;
          this.router.navigate(['/about']);
        },

        (err) => this.error = err); // Reach here if fails;

    } catch (e) {
      console.log(e);
    }

  }
};
