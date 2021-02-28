import { Injectable } from '@angular/core';
import { UrlTree, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanLoad {

  constructor( private usuarioService: UsuarioService ) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  // canLoad(): Promise<boolean> {
    console.log('Entro a guard UsuarioGuard');

    return this.usuarioService.validaToken();
  }

 /*  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return false;
  } */

}
