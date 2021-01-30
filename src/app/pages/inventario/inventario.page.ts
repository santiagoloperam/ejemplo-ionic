import { Component, Input, OnInit } from '@angular/core';
import { Item, Visitasitem } from '../../interfaces/interfaces';
import { ModalController, Platform } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx'
import { DatePipe } from '@angular/common';
import { VisitaItemsService } from '../../services/visita-items.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

@Input() item: Visitasitem;
@Input() item0: Item[] = []; 
itemStorage: Visitasitem; // Para ver si el item ya tenia info en el storage
fecha_vencimiento_min: string = ""; // Voy a iniciar solo con una fecha de vencimiento
// fecha_vencimiento_max: string = "";
updated = false;

  constructor( private modalCtrl: ModalController,
                public datePicker: DatePicker,
                public datePipe: DatePipe,
                public platform: Platform,
                public visitaItemsService: VisitaItemsService ) {
                  this.platform.ready().then( () => {
                    this.fecha_vencimiento_min = this.datePipe.transform( new Date, "dd-MM-yyyy" );
                  });
                 }

  async ionViewWillEnter() {
    // Si el Item ya tenia guardado algo en el storage cargue la data
    this.itemStorage = await this.visitaItemsService.getStorageItem(`${ this.item.visita_id }-${ this.item.id }`) || null;

    if ( this.itemStorage !== null ) {
      this.item = this.itemStorage
    } else {
      // Sino item sigue vacio con los ids como viene del input de los params del modal
    }
    
  }

  ngOnInit() {
  }

  selectedDate() {
    var options = {
      date: new Date,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_TRADITIONAL
    };
    this.datePicker.show( options )
      .then( (date) => {
        this.fecha_vencimiento_min = this.datePipe.transform( date, "dd-MM-yyyy" );
      });
  }

  updateItem( item: Visitasitem ) {
    // HACER LOS NGMODEL Y SETEAR LA VISITAITEM PARA ACTUALISAR EN EL SERVICE visitaItemsService
    item.fecha_vencimiento_min = this.fecha_vencimiento_min;
    this.visitaItemsService.updateVisitaItem( item ); 
     
    // VACIAR EL STORAGE SOLO DE LOS ITEMS DE ESA VISITA ??? cuando se maneje storage con item
  }

  salir() {
    this.modalCtrl.dismiss({ //Como aun no mado data el modal desde items visita no guarda en storage
       item: this.item 
    });
  }

}
