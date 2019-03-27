import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBankAccountType } from 'app/shared/model/bank-account-type.model';
import { AccountService } from 'app/core';
import { BankAccountTypeService } from './bank-account-type.service';

@Component({
    selector: 'jhi-bank-account-type',
    templateUrl: './bank-account-type.component.html'
})
export class BankAccountTypeComponent implements OnInit, OnDestroy {
    bankAccountTypes: IBankAccountType[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected bankAccountTypeService: BankAccountTypeService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.bankAccountTypeService.query().subscribe(
            (res: HttpResponse<IBankAccountType[]>) => {
                this.bankAccountTypes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInBankAccountTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IBankAccountType) {
        return item.id;
    }

    registerChangeInBankAccountTypes() {
        this.eventSubscriber = this.eventManager.subscribe('bankAccountTypeListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
