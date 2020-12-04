export interface RespuestaLogin {
  token: Token;
  user: User;
}

export interface User {
  headers: Headers;
  original: Usuario;
  exception?: any;
}

export interface Usuario {
  id?: number;
  name?: string;
  last_name?: string;
  email?: string;
  dni?: string;
  telefono?: string;
  email_verified_at?: any;
  active?: number;
  tipo_usuario?: number;
  empresa_id?: number;
  admin_id?: number;
  ciudad?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Token {
  headers: Headers;
  original: Original;
  exception?: any;
}

export interface Original {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RootObject {
  visitas?: Visita[];
  marcas?: Marca[];
  pdvs?: Pdv[];
}

export interface Pdv {
  id?: number;
  nombre?: string;
  ciudad?: number;
  direccion?: string;
  telefono?: string;
  contacto?: string;
  info?: string;
  empresa_id?: number;
  latitud?: number;
  longitud?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Marca {
  id?: number;
  nombre?: string;
  ciudad?: number;
  direccion?: string;
  telefono?: string;
  contacto?: string;
  info?: string;
  empresa_id?: number;
  updated_at?: string;
  created_at?: string;
}

export interface Visita {
  id?: number;
  fecha_prog?: string;
  pdv_id?: number;
  marca_id?: number;
  user_asignado?: number;
  url_foto?: string;
  time_foto?: string;
  latitud?: number;
  longitud?: number;
  nota?: any;
  estado?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Refresh {
  access_token: string;
  token_type: string;
  expires_in: number;
}



