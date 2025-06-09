import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalonesPageComponent } from './salones-page/salones-page.component';

const routes: Routes = [
  {
    path: 'aulas',
    component: SalonesPageComponent,
  },
  {
    path: '**',
    redirectTo: '/dashboard/aulas',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
