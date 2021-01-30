import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { VisitaItemsService } from '../../services/visita-items.service';
import { Item } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal') slides: IonSlides;

  avatars = [
    {
      img: 'av-1.png',
      seleccionado: true
    }
];

loginUser = {
  email: '',
  password: ''
};

itemslist: Item[] = [];


  constructor( private usuarioService: UsuarioService,
               private navCtrl: NavController,
               private uiService: UiServiceService,
               private visitaItemsService: VisitaItemsService ) { }

  ngOnInit() {
    // this.slides.lockSwipes( true );
  }

  async login( fLogin: NgForm ) {

    if ( fLogin.invalid ) { return; }

    const valido = await this.usuarioService.login( this.loginUser.email, this.loginUser.password );
    console.log(valido);

    if ( valido ) {
      // Navegar a Visitas
      this.itemslist = await this.visitaItemsService.getAllItems(); // GetAllitems debe conseguir los items referenciados no con el 
      // admin sino con la empresa_id de los items y a la que pertenece el mercaderista user del token
      this.navCtrl.navigateRoot('visitas', { animated: true });
      console.log(this.itemslist);
      this.uiService.presentToast('Usuario y contraseña correctos');
    } else {
      // Mostrar alerta de usuario y contraseña no correctos
      console.log('login no valido');
      console.log(valido);
      this.uiService.presentToast('Usuario y/o contraseña incorrectos');
    }

  }

}
