export type LocationCategory =
  | 'classroom'
  | 'laboratory'
  | 'library'
  | 'canteen'
  | 'administrative'
  | 'auditorium'
  | 'sports'
  | 'amenity'
  | 'entrance';

export interface FloorDirectory {
  floorNumber: number;
  floorName: string;
  rooms: string[];
}

export interface OperatingHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  is24Hours?: boolean;
}

export interface ContactInfo {
  inCharge: string;
  designation: string;
  phone: string;
  email: string;
  officeRoom: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: LocationCategory;
  shortDescription: string;
  description: string;
  block: string; // e.g. "Block A (Academic Core)", "Block B (Science & Engineering)", "Block C (Administration)"
  floorCount: number;
  floors: FloorDirectory[];
  facilities: string[];
  openingHours: OperatingHours;
  contact: ContactInfo;
  coordinates: {
    lat: number;
    lng: number;
  };
  gridPos: {
    x: number; // 0 - 1000 coordinate on campus blueprint
    y: number; // 0 - 700 coordinate on campus blueprint
  };
  isAccessible: boolean;
  hasElevator: boolean;
  image?: string;
  color?: string;
}

export interface WalkwayNode {
  id: string;
  name: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  locationId?: string; // If this node directly connects to a building entrance
}

export interface WalkwayEdge {
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  isStepFree: boolean;
  type: 'paved_walkway' | 'covered_corridor' | 'garden_path' | 'stairs';
  instruction: string;
}

export interface NavigationStep {
  stepNumber: number;
  instruction: string;
  distanceMeters: number;
  estimatedSeconds: number;
  icon: 'straight' | 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'arrive' | 'stairs' | 'elevator';
  landmark?: string;
}

export interface RouteComputationResult {
  fromLocation: CampusLocation;
  toLocation: CampusLocation;
  pathNodes: WalkwayNode[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  stepCount: number;
  caloriesBurned: number;
  steps: NavigationStep[];
  isAccessible: boolean;
}

export interface TestCaseItem {
  id: string;
  module: string;
  scenario: string;
  input: string;
  expectedResult: string;
  status: 'passed' | 'failed' | 'pending';
}
