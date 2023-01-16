import {WeatherService} from '../shared/weather-service';
import {StationValley} from '../shared/station-valley';
import {Component, EventEmitter, Output} from '@angular/core';
import {delay} from "../shared/util";

@Component({
  selector: 'wa-search-station',
  templateUrl: './search-station.component.html',
  styleUrls: ['./search-station.component.scss'],
})
export class SearchStationComponent {
  @Output() onStationSelected = new EventEmitter<StationValley>();

  public foundStations: StationValley[] = [];

  private lastSearchTerm: string = ""

  constructor(private ws: WeatherService) {
  }

  handleSelectedStation(station: StationValley): void {
    this.onStationSelected.emit(station);
  }

  async handleOnKeyUp(value: string): Promise<void> {
    await delay(500);
    if (this.lastSearchTerm === value) {
      return;
    }
    this.lastSearchTerm = value;
    this.foundStations = await this.ws.getStations(value)
  }
}
