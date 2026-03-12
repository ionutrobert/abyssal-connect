export interface Vessel {
  id: string;
  name: string;
  status: 'Active' | 'Docked' | 'Maintenance';
  location: string;
  task: string;
  latitude: number;
  longitude: number;
}

export interface Incident {
  id: string;
  cable: string;
  location: string;
  status: 'Response' | 'Investigation' | 'Resolved';
  eta: string;
  severity: 'high' | 'medium' | 'low';
  vesselId?: string;
}

export const vessels: Vessel[] = [
  { id: 'v1', name: 'ACV Endeavour', status: 'Active', location: 'North Atlantic', task: 'Cable inspection', latitude: 45.2, longitude: -30.1 },
  { id: 'v2', name: 'ACV Phoenix', status: 'Active', location: 'South Pacific', task: 'Repair operations', latitude: -25.4, longitude: -155.3 },
  { id: 'v3', name: 'ACV Neptune', status: 'Docked', location: 'Singapore', task: 'Crew change', latitude: 1.3, longitude: 103.8 },
  { id: 'v4', name: 'ACV Deep Sea', status: 'Active', location: 'Indian Ocean', task: 'Route survey', latitude: -12.5, longitude: 78.2 },
  { id: 'v5', name: 'ACV Titan', status: 'Maintenance', location: 'Rotterdam', task: 'Annual inspection', latitude: 51.9, longitude: 4.5 },
  { id: 'v6', name: 'ACV Aquarius', status: 'Active', location: 'Mediterranean', task: 'Emergency response', latitude: 36.7, longitude: 14.2 },
];

export const incidents: Incident[] = [
  { id: 'INC-2026-0342', cable: 'TAT-14', location: '50.2°N, 30.1°W', status: 'Response', eta: '4h', severity: 'high', vesselId: 'v1' },
  { id: 'INC-2026-0341', cable: 'PC-1', location: '35.4°N, 155.3°W', status: 'Investigation', eta: '18h', severity: 'medium', vesselId: 'v2' },
  { id: 'INC-2026-0340', cable: 'SEA-ME-WE 5', location: '12.5°N, 78.2°E', status: 'Resolved', eta: '-', severity: 'low', vesselId: 'v4' },
  { id: 'INC-2026-0339', cable: 'Apollo', location: '42.1°N, 65.3°W', status: 'Response', eta: '2h', severity: 'high', vesselId: 'v6' },
  { id: 'INC-2026-0338', cable: 'FLAG', location: '5.2°N, 45.3°E', status: 'Investigation', eta: '24h', severity: 'low', vesselId: undefined },
];

export const activeVesselsCount = vessels.filter(v => v.status === 'Active').length;
export const activeIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;
export const pendingResolutionCount = incidents.filter(i => i.status === 'Response').length;
