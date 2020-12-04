import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateVisitaPageRoutingModule } from './update-visita-routing.module';

import { UpdateVisitaPage } from './update-visita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateVisitaPageRoutingModule
  ],
  declarations: [UpdateVisitaPage]
})
export class UpdateVisitaPageModule {}
