import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateVisitaPage } from './update-visita.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateVisitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateVisitaPageRoutingModule {}
