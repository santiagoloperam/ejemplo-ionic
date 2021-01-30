import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { VisitaItemsRes, RespItems, Item, Visitasitem } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { UiServiceService } from './ui-service.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class VisitaItemsService {

  token = null;
  itemslist: Item[] = [];
  item: Visitasitem;

  constructor( private storage: Storage,
               private http: HttpClient,
               private usuarioService: UsuarioService,
               public ui: UiServiceService ) { this.token = this.usuarioService.token; }

  // Primero en visitas con visitasService.visitaItems1(id) cojo todo los items de inventario
  // CUANDO ESTOY EN VISITAS CLICKEO HACER INVENTARIO EN UNA ANTES DE NAVEGAR A SUS ITEMS GUARDO EN EL STORAGE
  // Y MANDO CON NAVCTRL A LA LISTA DE VISITAITEMS
  setVisitaItems( visitaId: number, visitaItemsRes: VisitaItemsRes ) { // SETEA TODA LA RESP DE LA VISITA
    this.storage.set( '' + visitaId, visitaItemsRes );
  }
// EN EL CONSTRUCTOR O EN ONINIT SETEO LA LISTA CON EL ID DE LA VISITA A GESTIONAR ITEMS
  getVisitaItems( visitaId: number ) { // GET TODA LA RESP DE LA VISITA
    return this.storage.get( '' + visitaId );
  }

  async getAllItems() { // SE PUEDE MEJORAR PASANDO EL PARAMETRO POR MARCA
    const headers = new HttpHeaders({
      //'Accept': 'application/json',
      'Authorization': `Bearer ${ this.token }`
    });
    console.log('token desde headers de items');
    console.log(this.token);
    await this.http.get<RespItems>(`${ URL }/auth/items`, { headers } )
      .subscribe( resp => {
        console.log(resp.items);
        // this.itemslist = resp.items;
        this.setStorageAllItems( resp.items );
      });
      return this.itemslist;
  } 
  
  setStorageAllItems( items0: Item[] ) {
    this.storage.set('items0', items0 );
    this.itemslist = items0;
  }

  

  updateVisitaItem( item: Visitasitem ) {

    const headers = new HttpHeaders({
      // 'Accept': 'application/json',
      'Authorization': `Bearer ${ this.token }`
    });

    console.log(item);

    this.http.put(`${ URL }/auth/visitas_items/update/${ item.id }`, item, { headers })
      .subscribe( resp => {
        console.log(resp);
           
        if ( resp['success'] ) {
          console.log(resp);
          this.ui.presentToast('Item Actualizado Correctamente');          
          return resp;
        } else {
        this.ui.presentToast('No se pudo subir la información');
        return;
        }
      });

    // SI HAY IMAGEN GUARDE LA URL EN EL SERVIDOR CON TODO EL UPDATE DE VISITA SINO SIN LA IMAGEN
    /* if ( item.url_foto ) {

      // const data = this.subirImagen( item.url_foto ); // AGREGAR EN BACKEND LA URL DE IMG EN SERVIDOR Y GUARDARLA EN visita.url_foto
        const data = null;
      if ( data ) {
        item.url_foto = data['url_foto'];
        return this.http.put( `${ URL }/auth/visitas_items/update/${ item.id }`, item, { headers } );
      } else {
        item.url_foto = null;
      }

    } else {
      return this.http.put( `${ URL }/auth/visitas_items/update/${ item.id }`, item, { headers } );
    }
 */
  } 

  getStorageAllItems() {
    if ( this.itemslist.length !== 0 ) {
      return this.itemslist;
    } else {
      return this.storage.get('items0');
    }
  }

  setStorageItem( key: string, item: Visitasitem) { // Seteo Item de visita individual al cerrar modal
    this.storage.set( key, item );
  }

  getStorageItem( key: string ) { // Pregunta al storage cuando vuelve a entrar al Item
    return this.storage.get( key );
  }

}
