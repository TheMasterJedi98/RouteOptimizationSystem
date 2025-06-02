"""
Multi-Depot Vehicle Routing Problem (MDVRP) Solver

This module contains algorithms for solving the Multi-Depot Vehicle Routing Problem.
It can be used as a standalone script or imported as a module.

The MDVRP is an extension of the VRP where multiple depots (warehouses) are available,
and vehicles must be assigned to depots and routes must be constructed to service customers.
"""

import math
import json
import random
from typing import List, Dict, Tuple, Any

# Type aliases
Location = Tuple[float, float]
Warehouse = Dict[str, Any]
Store = Dict[str, Any]
Truck = Dict[str, Any]
Route = Dict[str, Any]

class MDVRPSolver:
    """
    Multi-Depot Vehicle Routing Problem Solver
    
    This class implements algorithms for solving the MDVRP using:
    1. Initial construction via nearest neighbor
    2. Improvement via local search methods
    """
    
    def __init__(self, warehouses: List[Warehouse], stores: List[Store], trucks: List[Truck]):
        """
        Initialize the MDVRP solver
        
        Args:
            warehouses: List of warehouse objects with id, location, etc.
            stores: List of store objects with id, location, demand, etc.
            trucks: List of truck objects with id, capacity, warehouse_id, etc.
        """
        self.warehouses = warehouses
        self.stores = stores
        self.trucks = trucks
        self.routes = []
        
        # Precompute distances
        self.distances = {}
        self._precompute_distances()
    
    def _precompute_distances(self):
        """Calculate and store all pairwise distances between locations"""
        # Store warehouse-to-warehouse distances
        for w1 in self.warehouses:
            for w2 in self.warehouses:
                self.distances[(w1['id'], w2['id'])] = self._calculate_distance(
                    (w1['location']['lat'], w1['location']['lng']), 
                    (w2['location']['lat'], w2['location']['lng'])
                )
        
        # Store warehouse-to-store distances
        for w in self.warehouses:
            for s in self.stores:
                self.distances[(w['id'], s['id'])] = self._calculate_distance(
                    (w['location']['lat'], w['location']['lng']),
                    (s['location']['lat'], s['location']['lng'])
                )
                self.distances[(s['id'], w['id'])] = self.distances[(w['id'], s['id'])]
        
        # Store store-to-store distances
        for s1 in self.stores:
            for s2 in self.stores:
                self.distances[(s1['id'], s2['id'])] = self._calculate_distance(
                    (s1['location']['lat'], s1['location']['lng']),
                    (s2['location']['lat'], s2['location']['lng'])
                )
    
    def _calculate_distance(self, loc1: Location, loc2: Location) -> float:
        """
        Calculate the Haversine distance between two locations
        
        Args:
            loc1: Tuple of (latitude, longitude) for first location
            loc2: Tuple of (latitude, longitude) for second location
            
        Returns:
            Distance in kilometers
        """
        lat1, lon1 = loc1
        lat2, lon2 = loc2
        
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371  # Radius of earth in kilometers
        return c * r
    
    def assign_stores_to_warehouses(self):
        """
        Assign stores to warehouses based on proximity
        
        Returns:
            Dict mapping warehouse IDs to lists of store IDs
        """
        assignments = {w['id']: [] for w in self.warehouses}
        
        # For each store, find the closest warehouse
        for store in self.stores:
            closest_warehouse = None
            min_distance = float('inf')
            
            for warehouse in self.warehouses:
                dist = self.distances[(warehouse['id'], store['id'])]
                if dist < min_distance:
                    min_distance = dist
                    closest_warehouse = warehouse['id']
            
            if closest_warehouse:
                assignments[closest_warehouse].append(store['id'])
        
        return assignments
    
    def create_initial_routes(self):
        """
        Create initial routes using a simple construction heuristic
        
        Returns:
            List of routes
        """
        # First, assign stores to warehouses
        warehouse_assignments = self.assign_stores_to_warehouses()
        
        # Group trucks by warehouse
        warehouse_trucks = {}
        for truck in self.trucks:
            if truck['warehouseId'] not in warehouse_trucks:
                warehouse_trucks[truck['warehouseId']] = []
            warehouse_trucks[truck['warehouseId']].append(truck)
        
        routes = []
        
        # For each warehouse, create routes for its trucks
        for warehouse_id, store_ids in warehouse_assignments.items():
            if not store_ids:  # Skip if no stores assigned
                continue
                
            # Get trucks for this warehouse
            trucks = warehouse_trucks.get(warehouse_id, [])
            if not trucks:  # Skip if no trucks
                continue
            
            # Get store objects
            stores_to_assign = [s for s in self.stores if s['id'] in store_ids]
            
            # Sort stores by demand (descending)
            stores_to_assign.sort(key=lambda s: s['demand'], reverse=True)
            
            # Find the warehouse object
            warehouse = next(w for w in self.warehouses if w['id'] == warehouse_id)
            
            # Create routes using a simple bin-packing approach
            for truck in trucks:
                truck_capacity = truck['capacity']
                truck_routes = []
                current_route = []
                current_capacity = 0
                
                # Simple greedy approach - add stores until truck is full
                for store in stores_to_assign[:]:
                    if current_capacity + store['demand'] <= truck_capacity:
                        current_route.append(store['id'])
                        current_capacity += store['demand']
                        stores_to_assign.remove(store)
                
                if current_route:
                    # Optimize the route using nearest neighbor
                    optimized_route = self._optimize_route(warehouse_id, current_route)
                    
                    # Calculate route distance and time
                    distance, time = self._calculate_route_metrics(
                        warehouse_id, truck['id'], optimized_route, truck['speed']
                    )
                    
                    # Create route
                    route = {
                        'id': f"route_{len(routes) + 1}",
                        'warehouseId': warehouse_id,
                        'truckId': truck['id'],
                        'stores': optimized_route,
                        'distance': distance,
                        'estimatedTime': time,
                        'created': "2023-01-01T00:00:00Z"  # Placeholder
                    }
                    
                    routes.append(route)
            
            # If stores remain, assign them to the first truck
            if stores_to_assign and trucks:
                first_truck = trucks[0]
                remaining_store_ids = [s['id'] for s in stores_to_assign]
                
                # Optimize the route
                optimized_route = self._optimize_route(warehouse_id, remaining_store_ids)
                
                # Calculate route distance and time
                distance, time = self._calculate_route_metrics(
                    warehouse_id, first_truck['id'], optimized_route, first_truck['speed']
                )
                
                # Create route
                route = {
                    'id': f"route_{len(routes) + 1}",
                    'warehouseId': warehouse_id,
                    'truckId': first_truck['id'],
                    'stores': optimized_route,
                    'distance': distance,
                    'estimatedTime': time,
                    'created': "2023-01-01T00:00:00Z"  # Placeholder
                }
                
                routes.append(route)
        
        self.routes = routes
        return routes
    
    def _optimize_route(self, warehouse_id: str, store_ids: List[str]) -> List[str]:
        """
        Optimize a route using the nearest neighbor heuristic
        
        Args:
            warehouse_id: ID of the warehouse
            store_ids: List of store IDs to visit
            
        Returns:
            Optimized list of store IDs
        """
        if not store_ids:
            return []
        
        unvisited = store_ids.copy()
        current_location = warehouse_id
        tour = []
        
        while unvisited:
            # Find closest unvisited store
            nearest = min(unvisited, key=lambda store_id: self.distances[(current_location, store_id)])
            tour.append(nearest)
            current_location = nearest
            unvisited.remove(nearest)
        
        return tour
    
    def _calculate_route_metrics(self, warehouse_id: str, truck_id: str, 
                                store_ids: List[str], speed: float) -> Tuple[float, float]:
        """
        Calculate route distance and estimated time
        
        Args:
            warehouse_id: ID of the warehouse
            truck_id: ID of the truck
            store_ids: List of store IDs in the route
            speed: Speed of the truck in km/h
            
        Returns:
            Tuple of (distance in km, time in hours)
        """
        if not store_ids:
            return 0.0, 0.0
        
        total_distance = 0.0
        
        # Distance from warehouse to first store
        total_distance += self.distances[(warehouse_id, store_ids[0])]
        
        # Distance between stores
        for i in range(len(store_ids) - 1):
            total_distance += self.distances[(store_ids[i], store_ids[i+1])]
        
        # Distance from last store back to warehouse
        total_distance += self.distances[(store_ids[-1], warehouse_id)]
        
        # Calculate time (distance / speed)
        total_time = total_distance / speed
        
        return total_distance, total_time
    
    def improve_routes(self, iterations: int = 100):
        """
        Improve routes using local search techniques
        
        Args:
            iterations: Number of improvement iterations
            
        Returns:
            Improved list of routes
        """
        if not self.routes:
            self.create_initial_routes()
        
        for _ in range(iterations):
            # Apply 2-opt local search to each route
            for i, route in enumerate(self.routes):
                store_ids = route['stores']
                if len(store_ids) >= 4:  # Only apply 2-opt if there are enough stores
                    improved_route = self._two_opt(route['warehouseId'], store_ids)
                    
                    if improved_route != store_ids:
                        # Update route with improved sequence
                        self.routes[i]['stores'] = improved_route
                        
                        # Recalculate metrics
                        truck = next(t for t in self.trucks if t['id'] == route['truckId'])
                        distance, time = self._calculate_route_metrics(
                            route['warehouseId'], route['truckId'], improved_route, truck['speed']
                        )
                        
                        self.routes[i]['distance'] = distance
                        self.routes[i]['estimatedTime'] = time
        
        return self.routes
    
    def _two_opt(self, warehouse_id: str, route: List[str]) -> List[str]:
        """
        Apply 2-opt local search to improve a route
        
        Args:
            warehouse_id: ID of the warehouse
            route: List of store IDs representing the route
            
        Returns:
            Improved route
        """
        best_route = route.copy()
        improved = True
        
        while improved:
            improved = False
            best_distance = self._calculate_route_distance(warehouse_id, best_route)
            
            for i in range(len(route) - 1):
                for j in range(i + 1, len(route)):
                    new_route = best_route.copy()
                    # Reverse the segment between i and j
                    new_route[i:j+1] = reversed(new_route[i:j+1])
                    
                    new_distance = self._calculate_route_distance(warehouse_id, new_route)
                    
                    if new_distance < best_distance:
                        best_distance = new_distance
                        best_route = new_route
                        improved = True
            
        return best_route
    
    def _calculate_route_distance(self, warehouse_id: str, store_ids: List[str]) -> float:
        """
        Calculate the total distance of a route
        
        Args:
            warehouse_id: ID of the warehouse
            store_ids: List of store IDs in the route
            
        Returns:
            Total distance in km
        """
        if not store_ids:
            return 0.0
        
        total_distance = 0.0
        
        # Distance from warehouse to first store
        total_distance += self.distances[(warehouse_id, store_ids[0])]
        
        # Distance between stores
        for i in range(len(store_ids) - 1):
            total_distance += self.distances[(store_ids[i], store_ids[i+1])]
        
        # Distance from last store back to warehouse
        total_distance += self.distances[(store_ids[-1], warehouse_id)]
        
        return total_distance

def solve_mdvrp(warehouses, stores, trucks, iterations=100):
    """
    Solve the MDVRP problem
    
    Args:
        warehouses: List of warehouse objects
        stores: List of store objects
        trucks: List of truck objects
        iterations: Number of improvement iterations
        
    Returns:
        List of optimized routes
    """
    solver = MDVRPSolver(warehouses, stores, trucks)
    solver.create_initial_routes()
    solver.improve_routes(iterations)
    return solver.routes

if __name__ == "__main__":
    """
    Example usage as a standalone script
    
    Input should be a JSON file with warehouses, stores, and trucks
    Output will be a JSON file with optimized routes
    """
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python mdvrp.py input.json output.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        with open(input_file, 'r') as f:
            data = json.load(f)
        
        warehouses = data.get('warehouses', [])
        stores = data.get('stores', [])
        trucks = data.get('trucks', [])
        
        routes = solve_mdvrp(warehouses, stores, trucks)
        
        with open(output_file, 'w') as f:
            json.dump({'routes': routes}, f, indent=2)
            
        print(f"Successfully solved MDVRP and wrote results to {output_file}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)