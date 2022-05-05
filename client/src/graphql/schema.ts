export type Mission = {
  id: String;
  title: String;
  operator: String;
  launch: Launch;
  orbit: Orbit;
  payload: Payload;
}

export type Launch = {
  date: Date;
  vehicle: String;
  location: Location;
}

export type Location = {
  name: String;
  longitude: Number;
  Latitude: Number;
}

export type Orbit = {
  periapsis: Number;
  apoapsis: Number;
  inclination: Number;
}

export type Payload = {
  capacity: Number;
  available: Number;
}

// {
//   "title": "aaa","operator": "bbb","date": "2022-12-26T09:32:40.000Z","vehicle": "ddd","locationName": "hhh",
  
//   "locationLongitude": 1,"locationLatitude": 2,"orbidPeriapsis": 3,"orbidApoapsis": 4,"orbitInclination": 5,
//     "payloadCapacity": 6,"payloadAvailablity": 7
  
  
//   }