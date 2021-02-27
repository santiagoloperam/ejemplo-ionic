import { Injectable } from '@angular/core';
import {  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';
import { NavController } from '@ionic/angular';
import { Refresh } from '../interfaces/interfaces';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor( private usuarioService: UsuarioService,
                private http: HttpClient,
                private storage: Storage,
                private navCtrl: NavController ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 

    if(this.isBLockedList(req.url)) {
      return next.handle(req);
    }
    // NECESITA INTERCEPTOR?
    else {
      const token: string =  this.storage.getItem('token');
      if (token) {
        const headers = new HttpHeaders({      
          'Authorization': `Bearer ${ token }`
        });
    
        const reqClone = req.clone({
          headers
        }); 
        
        // SI - RETORNA EL REQUEST

        return next.handle( reqClone ).pipe(
          catchError((err: HttpErrorResponse) => {
    
            // 401 - TOKEN REFRESH
            if (err.status === 401) {
              console.log('pasó por INTERCEPTOR');
              this.http.post<Refresh>(`${ URL }/auth/refresh`, {}, {headers})
              .subscribe( resp => {
                if ( resp ) {
                  console.log('adentro de la promesa con  REFRESH');
                  console.log(resp);
                  // Carga el usuario del end point si el token es valido
                  // cargar nuevo token
                  this.storage.setItem('token',resp.access_token);
                  this.usuarioService.validaToken();
                } else {
                  // NO - AGREGA EL JWT
                  this.navCtrl.navigateRoot('login');
                }
              });
            }
              // CATCH ERROR
              return throwError( err );
    
            })
          );
    }
    
    // 400 - LOGIN (BORRAR TOKEN STORAGE)
    this.storage.setItem('token', null);

    

    
    }

  }
  
    // FILTRAR URLS DONDE NO SE REQUIEREN TOKENS
    private isBLockedList ( url: string ): Boolean {
      if (url == `${environment.url}/login`) {
        return true;
      } else {
        return false;
      }
    }

}
