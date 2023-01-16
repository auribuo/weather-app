import {StationDetailComponent} from './station-detail/station-detail.component';
import {StationListComponent} from './station-list/station-list.component';
import {HomeComponent} from './home/home.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/stations/name', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {
    path: 'stations/:sort',
    component: StationListComponent,
  },
  {
    path: 'stations/:sort/:code',
    component: StationDetailComponent,
  },
  {
    path: 'stations',
    redirectTo: '/stations/name',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
