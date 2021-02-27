import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { rejects } from 'assert';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  lastLogin = null;
  renovating = false;

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
    this.lastLogin = Date.now();
    await this.storage.set( 'token', this.token );
    await this.storage.set('lastLogin', this.lastLogin);

    this.validaToken();
  }

  async guardarUsuario( user: Usuario ) {
    this.usuario = user;
    await this.storage.set( 'usuario', this.usuario );
  }

  async cargarToken() {
    this.token =  await this.storage.get('token') || null;
    this.usuario = await this.storage.get('usuario');
    this.lastLogin = await this.storage.get('lastLogin');
  }

  /* 
   * Intenta obtener el token del storage, lo resuelve y si no hay token lo redirige al login.
   */
  async validaToken(): Promise<boolean> {
    if (!this.token) {
      await this.cargarToken();

      if (!this.token) {
        this.navCtrl.navigateRoot('login');

        return Promise.reject(false);
      }
    }
    
    await this.verifyLastLogin();

    return Promise.resolve(true);
  }

  async verifyLastLogin() {
    if (!this.renovating && this.lastLogin) {
      const now = (Date.now() / 60000);
      const lastLogin = (this.lastLogin / 60000);

      if (now - lastLogin > 1440) {
        this.renovating = true;

        const { access_token } = await this.refreshToken().toPromise();
        await this.guardarToken(access_token);

        const user = await this.getUserWithTokenAccess().toPromise();
        await this.guardarUsuario(user);

        this.renovating = false;
      }
    }
  }

  /* 
   * Obtener detalles del usuario con el token
   *
   * @param String token = Token del usuario
   * @return Observable<Usuario>
   */
  getUserWithTokenAccess(): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<Usuario>(`${URL}/auth/me`, { headers }).pipe(
      tap((user) => this.usuario = user)
    );
  }

  /* 
   * Generar un nuevo token
   *
   * @return Observable<{ access_token }>
   */
  refreshToken(): Observable<{ access_token }> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<Refresh>(`${URL}/auth/refresh`, {}, { headers }).pipe(
      tap(({ access_token }) => this.token = access_token)
    );
  }

}
