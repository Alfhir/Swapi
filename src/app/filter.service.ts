import { Injectable } from '@angular/core';
import { Filter } from '../models/filter.model';
import { Film, Species } from '../models/swapi-responses.model';
import { Subject, Observable } from 'rxjs';
import { SwapiService } from './swapi.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterCriteria$ = new Subject<Filter>();
  private filteredCharacterURL$ = new Subject<string[]>();
  // map film urls to arrays of character urls
  private _charactersByFilm: Map<string, string[]>;
  // map species urls to arrays of character urls
  private _charactersBySpecies: Map<string, string[]>;

  constructor(private swapiService: SwapiService) {
    // initialize Map<film_url, [character_url]>
    this.swapiService.getFilms().subscribe(
      response => {
        const films: Film[] = response.results as Film[];
        const pairs: any = films.map(film => [film.url, film.characters]);
        const map: Map<string, string[]> = new Map<string, string[]>(pairs);
        this._charactersByFilm = map;
      },
      err => console.log(err),
      () =>
        console.log(`films-character-map initialized with ${this._charactersByFilm.size} values`)
    );

    // initialize Map<species_url, [character_url]>
    const allSpecies: Species[] = [];
    this.swapiService.getSpecies().subscribe(
      response => {
        const species: Species[] = response.results as Species[];
        allSpecies.push(...species);
      },
      err => console.log(err),
      () => {
        const pairs: any = allSpecies.map(s => [s.url, s.people]);
        const map: Map<string, string[]> = new Map<string, string[]>(pairs);
        this._charactersBySpecies = map;
        console.log(
          `species-character-map initialized with ${this._charactersBySpecies.size} values`
        );
      }
    );

    this.filterCriteria$.subscribe(activeFilter => {
      console.log(`new active filter: ${JSON.stringify(activeFilter)}`);
      const { film_url, species_url } = activeFilter;

      // --------------------------------------------------------------------------
      // --------------------------------------------------------------------------
      // --------------------------------------------------------------------------
      // filter if one is empty TOO!!
      if (film_url && species_url) {
        // --------------------------------------------------------------------------
        // --------------------------------------------------------------------------
        // --------------------------------------------------------------------------

        const filteredByFilm = this._charactersByFilm.get(film_url);
        const filteredBySpecies = this._charactersBySpecies.get(species_url);
        console.log(` ${filteredByFilm.length} characters filtered by film`);
        console.log(` ${filteredBySpecies.length}  characters filtered by species`);
        // intersect
        const intersection = filteredByFilm.filter(x => filteredBySpecies.includes(x));
        console.log(` ${intersection.length} characters filtered by film AND species`);
        this.filteredCharacterURL$.next(intersection);
      }
    });
  }

  pushFilter(filter: Filter) {
    this.filterCriteria$.next(filter);
  }

  // returns array of character urls that match filter criteria
  get filteredCharacterUrlStream(): Subject<string[]> {
    return this.filteredCharacterURL$;
  }
}
