import { WeatherService } from './../shared/weather-service';
import { StationValley } from './../shared/station-valley';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'wa-search-station',
  templateUrl: './search-station.component.html',
  styleUrls: ['./search-station.component.scss'],
})
export class SearchStationComponent implements OnInit {
  @Output() onStationSelected = new EventEmitter<StationValley>();

  public foundStations: StationValley[] = [];

  private onSearchTermChanged = new EventEmitter<string>();

  constructor(private ws: WeatherService) {}

  ngOnInit(): void {
    this.onSearchTermChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(async (term: string) => await this.ws.getStations(term))
      )
      .subscribe((stations) => (this.foundStations = stations));
  }

  ngOnDestroy() {
    this.onSearchTermChanged.unsubscribe();
  }

  handleSelectedStation(station: StationValley) {
    this.onStationSelected.emit(station);
  }

  handleOnKeyUp(value: string) {
    this.onSearchTermChanged.emit(value);
  }
}
