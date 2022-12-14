import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StationValley } from './station-valley';

import { map } from 'rxjs/operators';
import { StationFactory } from './station-factory';

const API =
  'http://daten.buergernetz.bz.it/services/weather/station?categoryId=1&lang=de&format=json';

@Injectable()
export class WeatherService {
  private stations!: StationValley[];

  constructor(private http: HttpClient) {}

  getAll(sortOrder: string): Promise<StationValley[]> {
    if (this.stations != null) {
      return new Promise<StationValley[]>((resolve) => {
        resolve(this.sort(Object.assign([], this.stations), sortOrder));
      });
    } else {
      return (
        this.http
          // rome-ignore lint/suspicious/noExplicitAny: <explanation>
          .get<any>(API)
          .pipe(
            map((response) => response.rows),
            map((rawStations) =>
              // rome-ignore lint/suspicious/noExplicitAny: <explanation>
              rawStations.map((rawStation: any) =>
                StationFactory.fromObject(rawStation)
              )
            ),
            map((stations) => (this.stations = this.sort(stations, sortOrder)))
          )
          .toPromise()
      );
    }
  }

  async getStations(term: string) {
    if (this.stations == null) {
      this.stations = await this.getAll('name');
    }
    return this.stations.filter((s) =>
      s.name.toLowerCase().startsWith(term.toLowerCase())
    );
  }

  async get(code: string) {
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
