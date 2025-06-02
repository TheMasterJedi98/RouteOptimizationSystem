// Define types for our application

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: Location;
  capacity: number;
  address: string;
}

export interface Store {
  id: string;
  name: string;
  location: Location;
  demand: number;
  address: string;
  timeWindow?: {
    start: string;
    end: string;
  };
}

export interface Truck {
  id: string;
  name: string;
  capacity: number;
  speed: number;
  warehouseId: string;
}

export interface Route {
  id: string;
  warehouseId: string;
  truckId: string;
  stores: string[];
  distance: number;
  estimatedTime: number;
  created: string;
}