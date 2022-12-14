import { Station } from './station';
import { StationValley } from './station-valley';

export class StationFactory {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  static fromObject(rawStation: any): Station {
    let ret!: Station;
    switch (rawStation.categoryId) {
      case 1: {
        // StationValley wird angelegt
        ret = new StationValley(
          rawStation.altitude,
          rawStation.code,
          rawStation.id,
          new Date(rawStation.lastUpdated),
          parseFloat(rawStation.latitude.replace(',', '.')),
          parseFloat(rawStation.longitude.replace(',', '.')),
          rawStation.name,
          rawStation.measurements,
          rawStation.dd,
          rawStation.ff === null || rawStation.ff === '--'
            ? 0
            : parseFloat(rawStation.ff),
          rawStation.bb === null ? 0 : parseFloat(rawStation.bb),
          parseInt(rawStation.n, 10),
          rawStation.p === null || rawStation.p === '--'
            ? 0
            : parseFloat(rawStation.p),
          parseInt(rawStation.rh, 10),
          parseFloat(rawStation.t),
          rawStation.sd,
          rawStation.gs === null || rawStation.gs === '--'
            ? 0
            : parseInt(rawStation.gs, 10)
        );
        break;
      }
      case 2: {
        // Pegelstation wird angelegt
        throw new Error('Pegelstation nicht deklariert');
      }
      case 3: {
        // Bergstation wird angelegt
        throw new Error('Bergstation nicht deklariert');
      }
      default: {
        throw new Error('Falsche Kategorie');
      }
    }
    return ret;
  }
}
