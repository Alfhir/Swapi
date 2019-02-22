import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SwapiService } from '../swapi.service';
import { Film, Species } from '../../models/swapi-responses.model';
import { FilterService } from '../filter.service';

import { pluck } from 'rxjs/operators';

@Component({
  selector: 'swapi-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  filterForm: FormGroup;
  species: Species[] = [];
  films: Film[] = [];
  bornBefore: string;
  bornAfter: string;

  constructor(private swapiService: SwapiService, public filterService: FilterService) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      film_url: new FormControl(),
      species_url: new FormControl(),
      bornBefore: new FormControl(),
      bornAfter: new FormControl()
    });
    this.filterForm.valueChanges.subscribe(value => this.filterService.pushFilter(value));
    // Populate form controls with values from backend
    this.swapiService
      .getSpecies()
      .pipe(pluck('results'))
      .subscribe(result => {
        const speciesArray: Species[] = result as Species[];
        this.species.push(...speciesArray);
      });
    this.swapiService
      .getFilms()
      .pipe(pluck('results'))
      .subscribe(result => {
        const films: Film[] = result as Film[];
        this.films.push(...films);
      });
  }
}
