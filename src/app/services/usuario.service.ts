import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { RespuestaLogin, Usuario, Refresh } from '../interfaces/interfaces';
import { VisitaItemsService } from './visita-items.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  usuario: Usuario = {};

  constructor( private http: HttpClient,
               private storage: Storage,
               private navCtrl: NavController ) { }

 login( email: string, password: string ) {

    const data = { email, password };

    return new Promise<boolean>( resolve => {

      this.http.post<RespuestaLogin>(`${ URL }/auth/login`, data )
          .subscribe( async resp => {
            /* console.log(resp); */
            if ( resp.token ) {
              console.log('login con token y user ok!!!');
              await this.guardarToken( resp.token.original.access_token);
              await this.guardarUsuario( resp.user.original);
              // console.log((this.usuario));
              // console.log(resp['token']['original']['access_token']);
              resolve( true );
            } else {
              console.log('POR FIN ENTRÓ A LOGIN FALLIDO');
              this.token = null;
              this.storage.clear();
              resolve( false );
            }
          });

    });

  }

  logout() {
    this.token = null;
    this.usuario = {};
    this.storage.clear();
    this.navCtrl.navigateRoot('login', { animated: true });
  }

  async guardarToken( token: string ) {
    this.token = token;
    await this.storage.set( 'token', this.token );

    this.validaToken();
  }

  async guardarUsuario( user: Usuario ) {
    this.usuario = user;
    await this.storage.set( 'usuario', this.usuario );
    // console.log((this.storage.get('usuario')));
  }

  async cargarToken() {
    this.token =  await this.storage.get('token') || null;
    this.usuario = await this.storage.get('usuario');
  }




  async validaToken(): Promise<boolean> {
    // Cargar token del storage
    await this.cargarToken();
    // Si el token aun no existe resolvemos un falso
    if ( !this.token ) {
      this.navCtrl.navigateRoot('login');
      console.log('token null');
      return Promise.resolve( false );
    }
    // Si existe el token que continue con la validación normal o RESOLVE(TRUE) ya que hay token y usuario
    console.log('token ok DESDE VALIDAR TOKEN');
    
      return new Promise<boolean>( resolve => {
        
        const headers = new HttpHeaders({
        
          'Authorization': `Bearer ${ this.token }`
        });
        this.http.get<Usuario>(`${ URL }/auth/me`, {headers})
            .subscribe( resp => {
              if ( resp.id ) {
                console.log('adentro de la promesa con ME');
                console.log(resp);
                // Carga el usuario del end point si el token es valido
                this.usuario = resp;
                resolve( true );
              } else {          
                
                this.navCtrl.navigateRoot('login');
              }
            });
      });   
   

  } // FIN DE VALIDA TOKEN

  refreshToken() { // REFRESHER TOKEN PARA CUANDO SEPA COMO HACERLO Y NO EXPIRE SESION ACTIVAR EL INTERCEPTOR EN app.module
    return new Promise<boolean>( resolve => {
      // console.log('desde la promesa del catch');
      const headers = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ this.token }`
      });
      this.http.post<Refresh>(`${ URL }/auth/refresh`, {}, {headers})
          .subscribe( resp => {
            if ( resp ) {
              console.log('adentro de la promesa con  REFRESH');
              console.log(resp);
              // Carga el usuario del end point si el token es valido
              // cargar nuevo token
              this.token = resp.access_token;
              this.validaToken();
              resolve( true );
            } else {
              this.navCtrl.navigateRoot('login');
              resolve( false );
            }
          });
    });
  }

}
