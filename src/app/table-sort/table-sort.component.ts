import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {PaginationPage, PaginationPropertySort} from '../common/pagination';
import {Table} from '../common/table';
import {showLoading, hideLoading, doNothing} from "../common/loader";
import * as Rx from "rxjs/Rx";


@Component({
    selector: 'app-table-sort',
    templateUrl: './table-sort.component.html',
    styleUrls: ['./table-sort.component.css']
})
export class TableSortComponent<T> implements OnInit, OnChanges {

    @Input() label: string;
    @Input() property: string;
    @Input() table: Table<any>;
    @Input() page: PaginationPage<T>;

    sortDirection: string;
    sortClass: boolean = false;
    sortAscClass: boolean = false;
    sortDescClass: boolean = false;

    ngOnInit() {

    }

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
/*
            const testPage: PaginationPage<T> = this.page;
            const testSort: PaginationPropertySort = testPage.sort.find(e => e.property === this.property);

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
 */
        }

    }

    sortByProperty() {

        let sort: PaginationPropertySort;
        sort = {property: this.property, direction: this.sortDirection};

        let pageNumber = this.page.number - 1;
        if (pageNumber < 0) {
            pageNumber = 0;
        }

        let observable: Rx.Observable<any> = this.table.fetchPage(pageNumber, this.page.size, sort);

        if (observable != null) {
            showLoading();
            observable.subscribe(doNothing, hideLoading, hideLoading);
        }
    }

}
