import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsVisitaPage } from './items-visita.page';

const routes: Routes = [
  {
    path: '',
    component: ItemsVisitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsVisitaPageRoutingModule {}
