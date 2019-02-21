import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, pluck } from 'rxjs/operators';
import { SwapiService } from '../swapi.service';
import { Film, Species } from '../../models/swapi-responses.model';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'swapi-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  filterForm: FormGroup;
  filter;
  films: Film[];
  species: Species[];

  constructor(private fb: FormBuilder, private swapiService: SwapiService) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      film: '',
      species: '',
      birth_year: { value: 'date range', disabled: true }
    });
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
        // switchMap((term: string) => this.swapiService.getCombinatedStuff(term))
      )
      .subscribe(value => {
        this.filter = value;
      });
    // get all films and bind them to the select element
    this.swapiService.getAllFilms().subscribe(res => {
      this.films = res;
      this.filterForm.get('film').setValue(this.films[0].title);
    });
    // get all species and store them in local variable
    this.swapiService
      .getAllSpecies()
      // .pipe(tap(val => console.log(val)))
      .subscribe(res => (this.species = res));
  }
}
