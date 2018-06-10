import {Component, Inject, OnInit, Input, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as Rx from 'rxjs/Rx';
import {webServiceEndpoint, defaultItemsCountPerPage} from '../common/constants';
import {PaginationPage, PaginationPropertySort} from '../common/pagination';
import {Table} from '../common/table';
import {showLoading, hideLoading} from '../common/loader';
import {URLSearchParams} from '@angular/http';
import {Contact} from '../../models/contact';
import {ContactService} from '../../services/contacts.service';
import {GroupService} from '../../services/groups.service';
import {BaseHttpService} from '../../services/base-http.service';
import {GroupMembersComponent} from '../group-members/group-members.component';
import {GroupMember} from '../../models/group-member';

@Component({
  selector: 'app-group-member-selector',
  templateUrl: './group-member-selector.component.html',
  styleUrls: ['./group-member-selector.component.css'],
  providers: [ContactService, GroupService, BaseHttpService]
})

export class GroupMemberSelectorComponent implements Table<GroupMember> {
  groupMemberSelectionPage: any;
  self: GroupMemberSelectorComponent;
  pageNumber: number;

  groupId: string;
  contactId: string;


  //  constructor(private contactService: ContactService, private groupService: GroupService, @Inject(Router) private router: Router, @Inject(GroupMembersComponent) private groupMembersComponent: GroupMembersComponent, private route: ActivatedRoute) {}
  constructor(private contactService: ContactService, private groupService: GroupService, @Inject(Router) private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.params['id'];
    const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(0, defaultItemsCountPerPage, null);
    showLoading();
    observable.subscribe(() => {
    }, hideLoading, hideLoading);
    this.self = this;
  }

  update() {
    const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(this.pageNumber, defaultItemsCountPerPage, null);
    showLoading();
    observable.subscribe(() => {
    }, hideLoading, hideLoading);
  }

  fetchPage(pageNumber: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<PaginationPage<any>> {
    this.pageNumber = pageNumber;
    const observable: Rx.Observable<PaginationPage<any>> = this.contactService.findFilteredContacts(pageNumber, pageSize, sort, this.groupId);
    observable.subscribe(groupMemberSelectionPage => this.groupMemberSelectionPage = groupMemberSelectionPage);
    return observable;
  }

  search(): Rx.Observable<PaginationPage<any>> {
    const searchString = (<HTMLInputElement>document.getElementById('search_input')).value;
    if (searchString !== '') {
      const observable: Rx.Observable<PaginationPage<any>> =
        this.contactService.searchContacts(searchString, 0, defaultItemsCountPerPage, null);
      observable.subscribe(groupMemberSelectionPage => this.groupMemberSelectionPage = groupMemberSelectionPage);
      return observable;
    } else {
      const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(0, defaultItemsCountPerPage, null);
      showLoading();
      observable.subscribe(() => {
      }, hideLoading, hideLoading);
      return observable;
    }
  }

  add(contact) {
    this.contactId = contact.id;

    this.groupService.addGroupMember(this.groupId, this.contactId).subscribe();

    const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(0, defaultItemsCountPerPage, null);
    showLoading();
    observable.subscribe(() => {
    }, hideLoading, hideLoading);

    // this.groupMembersComponent.update();

  }

}

