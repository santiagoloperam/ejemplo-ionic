import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from './usuario.service';
import { VisitasService } from './visitas.service';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor( private alertController: AlertController,
               private toastController: ToastController,
               private usuarioService: UsuarioService ) { }

  async logoutAlert() {
    const alert = await this.alertController.create({
      message: 'Cuidado al salir de Mercatrack sin enviar a la nuve los datos capturados. Si desea continuar presione OK',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            return false;
          }
        }, {
          text: 'OK',
          handler: () => {
            this.usuarioService.logout();
          }
        }
      ]
    });

    await alert.present();
  }


  async presentToast( message: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
