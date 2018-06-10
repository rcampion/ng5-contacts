import {Directive, ElementRef, Input} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Directive({
    selector: '[isAuthorizedDirective]',
    providers: [LoginService]
})
export class IsAuthorizedDirective {
    @Input('isAuthorizedDirective') role: string;
    constructor(private _elementRef: ElementRef, private loginService: LoginService) {

    }
    ngOnInit(): void {
        if (this.role && this.role.trim() !== '' && !this.loginService.isAuthorized([this.role])) {
            const el: HTMLElement = this._elementRef.nativeElement;
            el.parentNode.removeChild(el);
        }
    }
}
