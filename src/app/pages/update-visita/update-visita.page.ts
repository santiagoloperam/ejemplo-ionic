import { Component, Input, OnInit } from '@angular/core';
import { Visita, Pdv } from '../../interfaces/interfaces';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { VisitasService } from '../../services/visitas.service';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-update-visita',
  templateUrl: './update-visita.page.html',
  styleUrls: ['./update-visita.page.scss'],
})
export class UpdateVisitaPage implements OnInit {

  constructor( private geolocation: Geolocation,
               private modalCtrl: ModalController,
               private visitasService: VisitasService,
               private uiService: UiServiceService ) { }

  @Input() visita: Visita;
  @Input() pdvs: Pdv[];
  posicion = false;
  updated = false;
  cargandoGeo = false;
  tempImages = [];

  ngOnInit() {
  }

  async actualizarVisita() {
    console.log(this.visita);
  }

  getGeo() {
    if ( !this.posicion ) {
      this.visita.longitud = undefined;
      this.visita.latitud = undefined;
      return;
    }


    this.geolocation.getCurrentPosition().then((resp) => {
      this.visita.latitud = +resp.coords.latitude;
      this.visita.longitud = +resp.coords.longitude;
      console.log(this.visita.longitud);
      console.log(this.visita.latitud);

      this.cargandoGeo = false;
      this.posicion = true;

     }).catch((error) => {
      this.cargandoGeo = false;
      console.log('Error getting location', error);
     });

  }

  camara() {

  }

  libreria() {

  }

  salir() {
    this.modalCtrl.dismiss({
      visita: this.visita
    });
  }

  updateVisita1( visita: Visita ) {
    // La visita viene como input desde visitas del storage actual de visitas
    visita.estado = 2;
    const updated = this.visitasService.updateVisita2( visita )
      .subscribe( async resp => {
        console.log(resp);
        if ( resp['success'] ) {
          this.uiService.presentToast('Visita Registrada'); // Visita actualizada
        } else {
          return;
        }
      });
  }

}
