import { StationValley } from './../shared/station-valley';
import { WeatherService } from './../shared/weather-service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wa-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent implements OnInit {
  constructor(
    private ws: WeatherService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public stations!: StationValley[];
  public descriptions = StationValley.descriptions;
  public units = StationValley.units;
  public sortOrder!: string;

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.sortOrder = params.sort;
      if (
        this.sortOrder !== 'name' &&
        this.sortOrder !== 'temperature' &&
        this.sortOrder !== 'precipitation' &&
        this.sortOrder !== 'airpressure'
      ) {
        this.router.navigate(['/stations', 'name']);
      }
      this.stations = await this.ws.getAll(params.sort);
    });
  }

  handleStationSelected(station: StationValley) {
    this.router.navigate(['/stations', this.sortOrder, station.code]);
  }
}
