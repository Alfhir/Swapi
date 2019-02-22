import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwapiResponse, Character, Result, Species } from '../models/swapi-responses.model';
import { Observable, range, of, EMPTY } from 'rxjs';
import { concatMap, takeWhile, shareReplay, map, reduce, expand } from 'rxjs/operators';

const SWAPI_API = `https://swapi.co/api`;
const ENDPOINTS = {
  people: `${SWAPI_API}/people`,
  species: `${SWAPI_API}/species`,
  films: `${SWAPI_API}/films`
};

// It takes 9 requests to fetch all characters
const CACHE_SIZE = 9;

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private characters$: Observable<Character[]>;
  private species$: Observable<SwapiResponse>;

  constructor(private http: HttpClient) {}

  // SIDE - EFFECTING
  // Gets all characters and caches results
  get characters(): Observable<Character[]> {
    if (!this.characters$) {
      this.characters$ = this.getCharacters(ENDPOINTS.people).pipe(
        expand(({ nextPage }) => (nextPage ? this.getCharacters(nextPage) : EMPTY)),
        concatMap(({ content }) => [content]),
        reduce((x, y) => [...x, ...y]),
        // do not unsubscribe from source when refCount drops to zero so HTTP-calls can always complete
        shareReplay({ bufferSize: CACHE_SIZE, refCount: false })
      ) as Observable<Character[]>;
    }
    return this.characters$;
  }

  private getCharacters(url: string): Observable<{ content: Result[]; nextPage: string | null }> {
    return this.http.get<SwapiResponse>(url).pipe(
      map(response => ({
        content: response.results,
        nextPage: this.next(response.next)
      }))
    );
  }
  private next(link: string | null): string | null {
    if (link) {
      const match = link.match(/https:\/\/swapi.co\/api\/people\/\?page=?[0-9]*/);
      if (match) {
        [link] = match;
        console.log(`fetching data from ${link}`);
      }
    }
    return link;
  }

  // TODO: Implement Deep Linking
  // If application routes to a character detail view before having routed to '/character',
  // this breaks because service will not be available yet.
  getCharacter(id: number): Observable<Character> {
    if (this.characters$) {
      let c$;
      const sub = this.characters$.subscribe((characters: Character[]) => {
        c$ = of(characters[id]);
      });
      sub.unsubscribe();
      return c$;
    }
  }

  // So far there are 37 species. This works for up to ten returned pages, i.e. up to 100 species
  getSpecies(): Observable<SwapiResponse> {
    console.log(`getting species`);
    if (!this.species$) {
      this.species$ = range(1, 10).pipe(
        concatMap(page => this.http.get<SwapiResponse>(`${ENDPOINTS.species}/?page=${page}`)),
        // when result does not link to next page complete observable
        takeWhile(res => res.next !== null, true),
        shareReplay({ bufferSize: CACHE_SIZE, refCount: false })
      );
    }
    return this.species$;
  }

  // Response is not paginated
  getFilms(): Observable<SwapiResponse> {
    console.log(`getting films`);
    return this.http.get<SwapiResponse>(ENDPOINTS.films);
  }
}
