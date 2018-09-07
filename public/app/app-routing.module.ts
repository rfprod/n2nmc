import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardIntroComponent } from './components/dashboard-intro.component';
import { DashboardLoginComponent } from './components/dashboard-login.component';
import { DashboardDetailsComponent } from './components/dashboard-details.component';

/**
 * Application routes.
 */
export const APP_ROUTES: Routes = [
	{path: 'intro', component: DashboardIntroComponent},
	{path: 'login', component: DashboardLoginComponent},
	{path: 'data', component: DashboardDetailsComponent},
	{path: '', redirectTo: 'intro', pathMatch: 'full'},
	{path: '**', redirectTo: 'intro'}
];

/**
 * Application routing module.
 */
@NgModule({
	imports: [ RouterModule.forRoot(APP_ROUTES) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
