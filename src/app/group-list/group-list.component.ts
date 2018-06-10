import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import * as Rx from 'rxjs/Rx';
import {webServiceEndpoint, defaultItemsCountPerPage} from '../common/constants';
import {PaginationPage, PaginationPropertySort} from '../common/pagination';
import {Table} from '../common/table';
import {showLoading, hideLoading} from '../common/loader';
import {URLSearchParams} from '@angular/http';
import {Group} from '../../models/group';
import {GroupService} from '../../services/groups.service';
import {BaseHttpService} from '../../services/base-http.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
  providers: [GroupService, BaseHttpService]
})

export class GroupListComponent implements Table<Group> {
  public groups: Group[] = [];

  groupPage: any;
  self: GroupListComponent;
  pageNumber: number;
  currentGroup:Group;

  constructor(private groupService: GroupService, @Inject(Router) private router: Router) {

  }

  ngOnInit() {
    const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(0, defaultItemsCountPerPage, null);
    showLoading();
    observable.subscribe(() => {
    }, hideLoading, hideLoading);
    this.self = this;
  }

  search(): Rx.Observable<PaginationPage<any>> {
    const searchString = (<HTMLInputElement>document.getElementById('search_input')).value;
    if (searchString !== '') {
      const observable: Rx.Observable<PaginationPage<any>> =
        this.groupService.searchGroups(searchString, 0, defaultItemsCountPerPage, null);
      observable.subscribe(groupPage => this.groupPage = groupPage);
      return observable;
    } else {
      const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(0, defaultItemsCountPerPage, null);
      showLoading();
      observable.subscribe(() => {
      }, hideLoading, hideLoading);
      return observable;
    }
  }

  fetchPage(pageNumber: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<PaginationPage<any>> {
    this.pageNumber = pageNumber;
    const observable: Rx.Observable<PaginationPage<any>> = this.groupService.findGroups(pageNumber, pageSize, sort);
    observable.subscribe(groupPage => this.groupPage = groupPage);
    return observable;
  }

  show(group) {
    this.router.navigate(['/group', group.groupId]);
  }

  add(group) {
    this.router.navigate(['/group']);
  }

  back() {
    this.router.navigate(['/GroupList']);
  };

  delete(group) {
    const observable: Rx.Observable<string> = this.groupService.removeGroup(group.groupId);
    showLoading();
    observable.switchMap(() => {
      return this.fetchPage(this.pageNumber, defaultItemsCountPerPage, null);
    }).subscribe(r => {
      this.fetchPage(this.pageNumber, defaultItemsCountPerPage, null);
    }, hideLoading, hideLoading);
  }
}
