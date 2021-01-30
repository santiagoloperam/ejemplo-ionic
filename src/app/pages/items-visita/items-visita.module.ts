import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsVisitaPageRoutingModule } from './items-visita-routing.module';

import { ItemsVisitaPage } from './items-visita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsVisitaPageRoutingModule
  ],
  declarations: [ItemsVisitaPage]
})
export class ItemsVisitaPageModule {}
