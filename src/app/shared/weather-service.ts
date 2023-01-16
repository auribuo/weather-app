import { Injectable } from '@angular/core';
import { StationValley } from './station-valley';

import { StationFactory } from './station-factory';
import axios from "axios";

const API =
  'http://daten.buergernetz.bz.it/services/weather/station?categoryId=1&lang=de&format=json';

@Injectable()
export class WeatherService {
  private stations!: StationValley[];

  constructor() {}

  // getAll(sortOrder: string): Promise<StationValley[]> {
  //   if (this.stations != null) {
  //     return new Promise<StationValley[]>((resolve) => {
  //       resolve(this.sort(Object.assign([], this.stations), sortOrder));
  //     });
  //   } else {
  //     return (
  //       this.http
  //         .get<any>(API)
  //         .pipe(
  //           map((response) => response.rows),
  //           map((rawStations) =>
  //             rawStations.map((rawStation: any) =>
  //               StationFactory.fromObject(rawStation)
  //             )
  //           ),
  //           map((stations) => (this.stations = this.sort(stations, sortOrder)))
  //         )
  //         .toPromise()
  //     );
  //   }
  // }

  async getAll(sortOrder: string): Promise<StationValley[]> {
    if (this.stations != null) {
      return new Promise<StationValley[]>((resolve) => {
        const sortedStations = this.sort(Object.assign([], this.stations), sortOrder);
        resolve(sortedStations);
      });
    } else {
      // use axios to fetch data from API, it's cleaner to read and doesn't use rxjs (which makes everything more complicated)
      // https://github.com/axios/axios
      const response = await axios.get(API);
      const rawStations = response.data.rows;
      const stations = rawStations.map((rawStation: any) =>
        StationFactory.fromObject(rawStation)
      );
      return (this.stations = this.sort(stations, sortOrder));
    }
  }

  async getStations(term: string): Promise<StationValley[]> {
    if (this.stations == null) {
      this.stations = await this.getAll('name');
    }
    return this.stations.filter((s) =>
      s.name.toLowerCase().startsWith(term.toLowerCase())
    );
  }

  async get(code: string): Promise<StationValley | undefined> {
    if (this.stations == null) {
      this.stations = await this.getAll('name');
    }
    return this.stations.find((s) => s.code === code);
  }

  private sort(stations: StationValley[], sortOrder: string): StationValley[] {
    switch (sortOrder) {
      case 'name': {
        return stations.sort((s1, s2) => s1.name.localeCompare(s2.name));
      }
      case 'temperature': {
        return stations.sort((s1, s2) =>
          Number.isNaN(s1.t) ? s2.t : Number.isNaN(s2.t) ? -s1.t : s2.t - s1.t
        );
      }
      case 'precipitation': {
        return stations.sort((s1, s2) =>
          Number.isNaN(s1.n) ? s2.n : Number.isNaN(s2.n) ? -s1.n : s2.n - s1.n
        );
      }
      case 'airpressure': {
        return stations.sort((s1, s2) =>
          Number.isNaN(s1.p) ? s2.p : Number.isNaN(s2.p) ? -s1.p : s2.p - s1.p
        );
      }
      default: {
        return stations;
      }
    }
  }
}
