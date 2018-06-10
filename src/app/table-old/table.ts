import {Component, OnChanges, EventEmitter, Input} from '@angular/core';
import {webServiceEndpoint} from '../common/constants';
import {PaginationPage, PaginationPropertySort} from '../common/pagination';
import * as Rx from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {showLoading, hideLoading} from '../common/loader';

export interface Table {

  fetchPage(pageNumber: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<any>;

}

@Component({
  selector: 'table-elements-count',
  templateUrl: './elements-count.html'

})
export class TableElementsCount<T> {
  @Input() page: PaginationPage<T>;
}

@Component({
  selector: 'table-pagination',
  templateUrl: './pagination.html'
})
export class TablePagination<T> {
  @Input() table: Table;
  @Input() page: PaginationPage<T>;

  get pagesIndexes(): Array<number> {
    const pagesIndexes: Array<number> = [];
    for (let i = 0; i < this.page.totalPages; i++) {
      pagesIndexes.push(i + 1);
    }
    return pagesIndexes;
  }

  fetchPageNumber(pageNumber: number) {
    const observable: Rx.Observable<any> = this.table.fetchPage(pageNumber - 1, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  }

  fetchPageSize(pageSize: number) {
    const observable: Rx.Observable<any> = this.table.fetchPage(this.page.number, pageSize, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  }

  fetchNextPage() {
    const pageToFetch: number = this.page.number + 1;

    if (pageToFetch >= this.page.totalPages) {
      return;
    }

    /* getting broken pipe .... ????? */
    this.fetchPageNumber(pageToFetch + 1);

    /*
    const observable: Rx.Observable<any> = this.table.fetchPage(pageToFetch, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  */
  }

  fetchPreviousPage() {
    if (this.page.number === 0) {
      return;
    }

    const observable: Rx.Observable<any> = this.table.fetchPage(this.page.number - 1, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  }

  private getSort(): PaginationPropertySort {
    if (this.page.sort != null && this.page.sort.length > 0) {
      return this.page.sort[0];
    } else {
      return null;
    }
  }
}

@Component({
  selector: 'table-sort',
  templateUrl: './sort.html'
})
export class TableSort<T> implements OnChanges {

  @Input() label: string;
  @Input() property: string;
  @Input() table: Table;
  @Input() page: PaginationPage<T>;

  sortDirection: string;
  sortClass = false;
  sortAscClass = false;
  sortDescClass = false;

  ngOnChanges(changes) {

    if (changes['page']) {

      const defineValues = (s, sa, sd, dir) => {
        this.sortClass = s;
        this.sortAscClass = sa;
        this.sortDescClass = sd;
        this.sortDirection = dir;
      };

      if (this.page.sort == null) {
        defineValues(true, false, false, 'ASC');
        return;
      }
      

      const one: PaginationPropertySort = this.page.sort.find(e => e.property === this.property);

      if (one == null) {
        defineValues(true, false, false, 'ASC');
      } else {
        if (one.direction === 'ASC') {
          defineValues(false, true, false, 'DESC');
        } else {
          defineValues(false, false, true, 'ASC');
        }
      }

    }
  }

  sortByProperty() {

    let sort: PaginationPropertySort;
    sort = {property: this.property, direction: this.sortDirection};

    let pageNumber = this.page.number - 1;
    if (pageNumber < 0) {
      pageNumber = 0;
    }

    const observable: Rx.Observable<any> = this.table.fetchPage(pageNumber, this.page.size, sort);

    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, () => {
        hideLoading()
      }, hideLoading);
    }
  }
}

export let tableDirectives: Array<any> = [
  TableElementsCount,
  TablePagination,
  TableSort,
];
