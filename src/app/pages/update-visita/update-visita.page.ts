import { Component, Input, OnInit } from '@angular/core';
import { Visita, Pdv } from '../../interfaces/interfaces';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { VisitasService } from '../../services/visitas.service';
import { UiServiceService } from '../../services/ui-service.service';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


declare var window: any;

@Component({
  selector: 'app-update-visita',
  templateUrl: './update-visita.page.html',
  styleUrls: ['./update-visita.page.scss'],
})
export class UpdateVisitaPage implements OnInit {

  constructor( private geolocation: Geolocation,
               private modalCtrl: ModalController,
               private visitasService: VisitasService,
               private uiService: UiServiceService,
               private camera: Camera ) { }

  @Input() visita: Visita;
  @Input() pdvs: Pdv[];
  posicion = false;
  updated = false;
  cargandoGeo = false;
  // tempImages = []; solo voy a mandar una imagen por visita
  img: string;

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
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    this.procesarImagen( options );
  }

  libreria() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI, // si quiero que me devuelva la ruta de la img en device
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    this.procesarImagen( options );
  }

  procesarImagen( options: CameraOptions) {
    this.camera.getPicture(options).then( ( imageData ) => { // imageData es una cadena que contiene la ruta del archivo
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.img = window.Ionic.WebView.convertFileSrc( imageData );
      // NO VOY A GUARDAR LA IMAGEN EN SERVIDOR CUANDO SE TOME SINO CUANDO SE ACTUALICE TODA LA VISITA
      // this.visitasService.subirImagen( imageData ); // ESTO SE DEBE LLAMAR EN EL UPDATE

      // GENERAR MÉTODO PARA SOSTENER IMAGEN Y URL EN STORAGE
      console.log( this.img );
     }, (err) => {
      // Handle error
     });
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
