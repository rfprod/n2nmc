"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var event_emitter_service_1 = require('../services/event-emitter.service');
var users_list_service_1 = require('../services/users-list.service');
var DashboardDetailsComponent = (function () {
    function DashboardDetailsComponent(el, emitter, usersListService) {
        this.el = el;
        this.emitter = emitter;
        this.usersListService = usersListService;
        this.usersList = [];
        /*
        *	sort
        */
        this.orderProp = 'role';
        console.log('this.el.nativeElement:', this.el.nativeElement);
    }
    DashboardDetailsComponent.prototype.getUsersList = function (callback) {
        var _this = this;
        this.usersListService.getUsersList().subscribe(function (data) { return _this.usersList = data; }, function (error) { return _this.errorMessage = error; }, function () {
            console.log('getUserList done');
            callback(_this.usersList);
        });
    };
    DashboardDetailsComponent.prototype.showDetails = function (event) {
        // had to disable all tslint rules for previous line, disabling no-unused-variable is buggy
        console.log('mouse enter');
        var domEl = event.target.querySelector('.details');
        console.log('domEl:', domEl);
        domEl.style.display = 'flex';
    };
    DashboardDetailsComponent.prototype.hideDetails = function (event) {
        // had to disable all tslint rules for previous line, disabling no-unused-variable is buggy
        console.log('mouse leave');
        var domEl = event.target.querySelector('.details');
        console.log('domEl:', domEl);
        domEl.style.display = 'none';
    };
    Object.defineProperty(DashboardDetailsComponent.prototype, "searchQuery", {
        get: function () {
            return this.searchValue;
        },
        set: function (val) {
            this.emitSearchValueChangeEvent(val);
        },
        enumerable: true,
        configurable: true
    });
    DashboardDetailsComponent.prototype.emitSearchValueChangeEvent = function (val) {
        console.log('searchValue changed to:', val);
        this.emitter.emitEvent({ search: val });
    };
    Object.defineProperty(DashboardDetailsComponent.prototype, "sortByCriterion", {
        get: function () {
            return this.orderProp;
        },
        set: function (val) {
            this.emitOrderPropChangeEvent(val);
        },
        enumerable: true,
        configurable: true
    });
    DashboardDetailsComponent.prototype.emitOrderPropChangeEvent = function (val) {
        console.log('orderProp changed to:', val);
        this.emitter.emitEvent({ sort: val });
    };
    /*
    *	spinner
    */
    DashboardDetailsComponent.prototype.emitSpinnerStartEvent = function () {
        console.log('root spinner start event emitted');
        this.emitter.emitEvent({ sys: 'start spinner' });
    };
    DashboardDetailsComponent.prototype.emitSpinnerStopEvent = function () {
        console.log('root spinner stop event emitted');
        this.emitter.emitEvent({ sys: 'stop spinner' });
    };
    DashboardDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('ngOnInit: DashboardDetailsComponent initialized');
        this.emitSpinnerStartEvent();
        this.emitter.emitEvent({ route: '/data' });
        this.emitter.emitEvent({ appInfo: 'hide' });
        this.subscription = this.emitter.getEmitter().subscribe(function (message) {
            console.log('/data consuming event:', JSON.stringify(message));
            if (message.search || message.search === '') {
                console.log('searching:', message.search);
                var domElsUsername = _this.el.nativeElement.querySelector('ul.listing').querySelectorAll('#full-name');
                for (var _i = 0, domElsUsername_1 = domElsUsername; _i < domElsUsername_1.length; _i++) {
                    var usernameObj = domElsUsername_1[_i];
                    if (usernameObj.innerHTML.toLowerCase().indexOf(message.search.toLowerCase()) !== -1) {
                        usernameObj.parentElement.parentElement.style.display = 'block';
                    }
                    else {
                        usernameObj.parentElement.parentElement.style.display = 'none';
                    }
                }
            }
            if (message.sort) {
                /*
                * sorting rules
                */
                console.log('sorting by:', message.sort);
                if (message.sort === 'registered') {
                    _this.usersList.sort(function (a, b) {
                        return b.registered - a.registered;
                    });
                }
                if (message.sort === 'role') {
                    _this.usersList.sort(function (a, b) {
                        if (a.role < b.role) {
                            return -1;
                        }
                        if (a.role > b.role) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }
        });
        this.getUsersList(function (userlList) {
            console.log('users list:', userlList);
            _this.emitSpinnerStopEvent();
        });
    };
    DashboardDetailsComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy: DashboardDetailsComponent destroyed');
        this.subscription.unsubscribe();
    };
    DashboardDetailsComponent = __decorate([
        core_1.Component({
            selector: 'dashboard-details',
            templateUrl: '/public/app/views/dashboard-details.html',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, event_emitter_service_1.EventEmitterService, users_list_service_1.UsersListService])
    ], DashboardDetailsComponent);
    return DashboardDetailsComponent;
}());
exports.DashboardDetailsComponent = DashboardDetailsComponent;
//# sourceMappingURL=dashboard-details.component.js.map