import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';
import { Storage } from '@ionic/storage';
import { RootObject, Visita, VisitaItemsRes } from '../interfaces/interfaces';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class VisitasService {

  paginaVisitas = 0;
  usuario = {};
  token = null;

  constructor( private http: HttpClient,
               private usuarioService: UsuarioService,
               private storage: Storage,
               private fileTransfer: FileTransfer ) {
    this.usuario = this.usuarioService.usuario;
    this.token = this.usuarioService.token;
  }

  getVisitas() { // Se llama al inicio y al refrescar la lista de visitas

    this.paginaVisitas++; // Aun no uso esta variable porque en laravel no le pongo paginador a las consultas

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      // 'Accept-Encoding': 'gzip,deflate,br',
      // 'Connection': 'keep-alive',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${ this.token }`
    });

    return this.http.get<RootObject>( `${ URL }/auth/visitas/user`, { headers } );

    // return this.http.get(`${ URL }/api/auth/visitas/user?pagina=${ this.paginaVisitas }`);

  }

  storageVisitas( visitas: Visita[] ) {
    this.storage.set('visitas', visitas);
  }

  getStorageVisitas() {
    return this.storage.get('visitas');
  }

  updateVisita2( visita: Visita ) {

    const headers = new HttpHeaders({
      // 'Accept': 'application/json',
      // 'Accept-Encoding': 'gzip,deflate,br',
      // 'Connection': 'keep-alive',
      // 'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${ this.token }`
    });

    console.log(visita.id);

    // SI HAY IMAGEN GUARDE LA URL EN EL SERVIDOR CON TODO EL UPDATE DE VISITA SINO SIN LA IMAGEN
    if ( visita.img ) {

      const data = this.subirImagen( visita.img ); // AGREGAR EN BACKEND LA URL DE IMG EN SERVIDOR Y GUARDARLA EN visita.url_foto

      if ( data['url_foto'] ) {
        visita.url_foto = data['url_foto'];
        return this.http.put( `${ URL }/auth/visitas/update/${ visita.id }`, visita, { headers } );
      } else {
        visita.url_foto = null;
      }

    } else {
      return this.http.put( `${ URL }/auth/visitas/update/${ visita.id }`, visita, { headers } );
    }


  }

  subirImagen( img: string ) { // supuestamente img es el mismo imageData que devuelve camera.getPicture = imageData
    const options: FileUploadOptions = {
      fileKey: 'img',
      headers: {
        'Authorization': `Bearer ${ this.token }`
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    // fileTransfer.upload('SOURCE_FILE_PATH in the device', 'API_ENDPOINT', options)
    fileTransfer.upload( img, `${ URL }/api/auth/uploadImg`)
      .then( data => {
        console.log(data);
        return data;
      }).catch( err => {
          console.log('Error en carga!', err);
      });
  }

  visitaItems1( visitaId ) {
    // end point para devolver todos los items y listarlos para luego pasar a la interfaz que actualiza visitaItems
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      // 'Accept-Encoding': 'gzip,deflate,br',
      // 'Connection': 'keep-alive',
      // 'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${ this.token }`
    });

    return this.http.get<VisitaItemsRes>( `${ URL }/auth/visitas_items/${ visitaId }`, { headers } );
  }

}
