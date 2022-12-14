import { ActivatedRoute } from '@angular/router';
import { WeatherService } from './../shared/weather-service';
import { StationValley } from './../shared/station-valley';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wa-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
})
export class StationDetailComponent implements OnInit {
  constructor(private ws: WeatherService, private route: ActivatedRoute) {}

  public station!: StationValley | undefined;
  public sortOrder!: string;
  public units = StationValley.units;
  public descriptions = StationValley.descriptions;
  public table!: {
    name: string;
    value: string;
  }[];
  public measurmentUrls: (string | undefined)[] | undefined;

  public columnsToDisplay = ['name', 'value'];

  async ngOnInit() {
    this.sortOrder = this.route.snapshot.params.sort;
    this.station = await this.ws.get(this.route.snapshot.params.code);
    if (this.station) {
      this.table = [
        {
          name: this.descriptions.t,
          value: `${this.station.t} ${this.units.t}`,
        },
        {
          name: this.descriptions.rh,
          value: `${this.station.rh} ${this.units.rh}`,
        },
        {
          name: this.descriptions.p,
          value: `${this.station.p} ${this.units.p}`,
        },
        {
          name: this.descriptions.n,
          value: `${this.station.n} ${this.units.n}`,
        },
        {
          name: this.descriptions.dd,
          value: `${this.station.dd}`,
        },
        {
          name: this.descriptions.ff,
          value: `${this.station.ff} ${this.units.ff}`,
        },
        {
          name: this.descriptions.sd,
          value: `${this.station.sd} ${this.units.sd}`,
        },
        {
          name: this.descriptions.gs,
          value: `${this.station.gs} ${this.units.gs}`,
        },
      ];
      this.measurmentUrls = this.filterMeasurmentUrls();
    }
  }

  public filterMeasurmentUrls() {
    switch (this.sortOrder) {
      case 'name':
        return this.station?.measurements.map((m) => m.imageUrl);
      case 'temperature':
        return [
          this.station?.measurements.find((m) => m.code === 'LT')?.imageUrl,
        ];
      case 'precipitation':
        return [
          this.station?.measurements.find((m) => m.code === 'N')?.imageUrl,
        ];
      case 'airpressure':
        return [
          this.station?.measurements.find((m) => m.code === 'LD.RED')?.imageUrl,
        ];
      default:
        return [];
    }
  }
}
