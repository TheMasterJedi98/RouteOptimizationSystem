/**
 * Data Store
 * 
 * This Zustand store manages all application data including warehouses, stores, trucks, and routes.
 * It provides CRUD operations and route optimization functionality.
 * 
 * The store includes sample data for development and testing purposes.
 */
import { create } from 'zustand';
import { Warehouse, Store, Truck, Route } from '../types';

/**
 * Data State Interface
 * 
 * Defines the shape of the data store state and all available actions.
 */
interface DataState {
  // State arrays
  warehouses: Warehouse[];
  stores: Store[];
  trucks: Truck[];
  routes: Route[];
  
  // Warehouse management actions
  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => void;
  updateWarehouse: (id: string, data: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  
  // Store management actions
  addStore: (store: Omit<Store, 'id'>) => void;
  updateStore: (id: string, data: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  
  // Truck management actions
  addTruck: (truck: Omit<Truck, 'id'>) => void;
  updateTruck: (id: string, data: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;
  
  // Route management actions
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, data: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
  
  // Route optimization action
  generateRoutes: () => void;
}

/**
 * Sample Warehouses Data
 * 
 * Initial warehouse data for development and testing.
 * Includes locations in major US cities with realistic coordinates.
 */
const sampleWarehouses: Warehouse[] = [
  {
    id: 'w1',
    name: 'Central Warehouse',
    location: { lat: 40.7128, lng: -74.0060 }, // New York City
    capacity: 1000,
    address: '123 Main St, New York, NY'
  },
  {
    id: 'w2',
    name: 'West Distribution Center',
    location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    capacity: 800,
    address: '456 Market St, San Francisco, CA'
  }
];

/**
 * Sample Stores Data
 * 
 * Initial store data with varying demands and time windows.
 * Distributed across different geographic locations.
 */
const sampleStores: Store[] = [
  {
    id: 's1',
    name: 'Downtown Store',
    location: { lat: 40.7112, lng: -74.0055 }, // Near NYC warehouse
    demand: 50,
    address: '789 Broadway, New York, NY',
    timeWindow: { start: '09:00', end: '17:00' }
  },
  {
    id: 's2',
    name: 'Uptown Store',
    location: { lat: 40.8075, lng: -73.9626 }, // Bronx area
    demand: 30,
    address: '555 5th Ave, New York, NY',
    timeWindow: { start: '08:00', end: '18:00' }
  },
  {
    id: 's3',
    name: 'SF Downtown',
    location: { lat: 37.7833, lng: -122.4167 }, // Near SF warehouse
    demand: 40,
    address: '123 Market St, San Francisco, CA',
    timeWindow: { start: '10:00', end: '19:00' }
  }
];

/**
 * Sample Trucks Data
 * 
 * Initial truck fleet with different capacities and speeds.
 * Assigned to specific warehouses.
 */
const sampleTrucks: Truck[] = [
  {
    id: 't1',
    name: 'Truck 001',
    capacity: 200,
    speed: 60, // km/h
    warehouseId: 'w1'
  },
  {
    id: 't2',
    name: 'Truck 002',
    capacity: 150,
    speed: 55, // km/h
    warehouseId: 'w1'
  },
  {
    id: 't3',
    name: 'Truck 003',
    capacity: 180,
    speed: 65, // km/h
    warehouseId: 'w2'
  }
];

/**
 * Data Store Implementation
 * 
 * Creates the main data store with all CRUD operations and route generation.
 */
const useDataStore = create<DataState>((set, get) => ({
  // Initialize with sample data
  warehouses: sampleWarehouses,
  stores: sampleStores,
  trucks: sampleTrucks,
  routes: [],
  
  // Warehouse Management Methods
  
  /**
   * Add Warehouse
   * 
   * Creates a new warehouse with auto-generated ID.
   * 
   * @param warehouse - Warehouse data without ID
   */
  addWarehouse: (warehouse) => {
    const newWarehouse = {
      ...warehouse,
      // Generate unique ID
      id: Math.random().toString(36).substring(2, 9)
    };
    set((state) => ({
      warehouses: [...state.warehouses, newWarehouse]
    }));
  },
  
  /**
   * Update Warehouse
   * 
   * Updates an existing warehouse with new data.
   * 
   * @param id - Warehouse ID to update
   * @param data - Partial warehouse data to update
   */
  updateWarehouse: (id, data) => {
    set((state) => ({
      warehouses: state.warehouses.map((warehouse) => 
        warehouse.id === id ? { ...warehouse, ...data } : warehouse
      )
    }));
  },
  
  /**
   * Delete Warehouse
   * 
   * Removes a warehouse from the system.
   * 
   * @param id - Warehouse ID to delete
   */
  deleteWarehouse: (id) => {
    set((state) => ({
      warehouses: state.warehouses.filter((warehouse) => warehouse.id !== id)
    }));
  },
  
  // Store Management Methods
  
  /**
   * Add Store
   * 
   * Creates a new store with auto-generated ID.
   * 
   * @param store - Store data without ID
   */
  addStore: (store) => {
    const newStore = {
      ...store,
      // Generate unique ID
      id: Math.random().toString(36).substring(2, 9)
    };
    set((state) => ({
      stores: [...state.stores, newStore]
    }));
  },
  
  /**
   * Update Store
   * 
   * Updates an existing store with new data.
   * 
   * @param id - Store ID to update
   * @param data - Partial store data to update
   */
  updateStore: (id, data) => {
    set((state) => ({
      stores: state.stores.map((store) => 
        store.id === id ? { ...store, ...data } : store
      )
    }));
  },
  
  /**
   * Delete Store
   * 
   * Removes a store from the system.
   * 
   * @param id - Store ID to delete
   */
  deleteStore: (id) => {
    set((state) => ({
      stores: state.stores.filter((store) => store.id !== id)
    }));
  },
  
  // Truck Management Methods
  
  /**
   * Add Truck
   * 
   * Creates a new truck with auto-generated ID.
   * 
   * @param truck - Truck data without ID
   */
  addTruck: (truck) => {
    const newTruck = {
      ...truck,
      // Generate unique ID
      id: Math.random().toString(36).substring(2, 9)
    };
    set((state) => ({
      trucks: [...state.trucks, newTruck]
    }));
  },
  
  /**
   * Update Truck
   * 
   * Updates an existing truck with new data.
   * 
   * @param id - Truck ID to update
   * @param data - Partial truck data to update
   */
  updateTruck: (id, data) => {
    set((state) => ({
      trucks: state.trucks.map((truck) => 
        truck.id === id ? { ...truck, ...data } : truck
      )
    }));
  },
  
  /**
   * Delete Truck
   * 
   * Removes a truck from the system.
   * 
   * @param id - Truck ID to delete
   */
  deleteTruck: (id) => {
    set((state) => ({
      trucks: state.trucks.filter((truck) => truck.id !== id)
    }));
  },
  
  // Route Management Methods
  
  /**
   * Add Route
   * 
   * Creates a new route with auto-generated ID.
   * 
   * @param route - Route data without ID
   */
  addRoute: (route) => {
    const newRoute = {
      ...route,
      // Generate unique ID
      id: Math.random().toString(36).substring(2, 9)
    };
    set((state) => ({
      routes: [...state.routes, newRoute]
    }));
  },
  
  /**
   * Update Route
   * 
   * Updates an existing route with new data.
   * 
   * @param id - Route ID to update
   * @param data - Partial route data to update
   */
  updateRoute: (id, data) => {
    set((state) => ({
      routes: state.routes.map((route) => 
        route.id === id ? { ...route, ...data } : route
      )
    }));
  },
  
  /**
   * Delete Route
   * 
   * Removes a route from the system.
   * 
   * @param id - Route ID to delete
   */
  deleteRoute: (id) => {
    set((state) => ({
      routes: state.routes.filter((route) => route.id !== id)
    }));
  },
  
  /**
   * Generate Optimized Routes
   * 
   * Creates optimized delivery routes using a simplified algorithm.
   * This is a mock implementation - in production, this would call
   * a backend service with advanced optimization algorithms.
   * 
   * Algorithm steps:
   * 1. Clear existing routes
   * 2. For each warehouse, find nearby stores
   * 3. Assign stores to trucks based on capacity
   * 4. Calculate distances and times
   * 5. Create route objects
   */
  generateRoutes: () => {
    const { warehouses, stores, trucks } = get();
    
    // Step 1: Clear existing routes
    set({ routes: [] });
    
    // Step 2: Process each warehouse
    warehouses.forEach(warehouse => {
      // Get trucks assigned to this warehouse
      const warehouseTrucks = trucks.filter(t => t.warehouseId === warehouse.id);
      
      if (warehouseTrucks.length === 0) return;
      
      /**
       * Calculate Haversine Distance
       * 
       * Calculates the great-circle distance between two points on Earth.
       * This is a simplified calculation - real routing would use road networks.
       * 
       * @param lat1 - Latitude of first point
       * @param lon1 - Longitude of first point
       * @param lat2 - Latitude of second point
       * @param lon2 - Longitude of second point
       * @returns Distance in kilometers
       */
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };
      
      // Step 3: Calculate distances from warehouse to all stores
      const storesWithDistance = stores.map(store => ({
        ...store,
        distance: calculateDistance(
          warehouse.location.lat, warehouse.location.lng,
          store.location.lat, store.location.lng
        )
      }));
      
      // Sort stores by distance (closest first for efficiency)
      storesWithDistance.sort((a, b) => a.distance - b.distance);
      
      // Step 4: Initialize truck assignments
      const truckAssignments: Record<string, string[]> = {};
      warehouseTrucks.forEach(truck => {
        truckAssignments[truck.id] = [];
      });
      
      // Step 5: Distribute stores among trucks (round-robin)
      storesWithDistance.forEach((store, index) => {
        const truckIndex = index % warehouseTrucks.length;
        const truckId = warehouseTrucks[truckIndex].id;
        truckAssignments[truckId].push(store.id);
      });
      
      // Step 6: Create route objects for each truck
      Object.entries(truckAssignments).forEach(([truckId, storeIds]) => {
        if (storeIds.length === 0) return;
        
        // Calculate total route distance
        let totalDistance = 0;
        let prevLat = warehouse.location.lat;
        let prevLng = warehouse.location.lng;
        
        // Sum distances between consecutive stops
        storeIds.forEach(storeId => {
          const store = stores.find(s => s.id === storeId)!;
          totalDistance += calculateDistance(
            prevLat, prevLng,
            store.location.lat, store.location.lng
          );
          // Update position for next calculation
          prevLat = store.location.lat;
          prevLng = store.location.lng;
        });
        
        // Add return trip to warehouse
        totalDistance += calculateDistance(
          prevLat, prevLng,
          warehouse.location.lat, warehouse.location.lng
        );
        
        // Calculate estimated time based on truck speed
        const truck = trucks.find(t => t.id === truckId)!;
        const estimatedTime = totalDistance / truck.speed;
        
        // Create the route object
        const route: Route = {
          id: Math.random().toString(36).substring(2, 9),
          warehouseId: warehouse.id,
          truckId,
          stores: storeIds,
          distance: parseFloat(totalDistance.toFixed(2)), // Round to 2 decimals
          estimatedTime: parseFloat(estimatedTime.toFixed(2)), // Round to 2 decimals
          created: new Date().toISOString()
        };
        
        // Add route to store
        set((state) => ({
          routes: [...state.routes, route]
        }));
      });
    });
  }
}));

export default useDataStore;