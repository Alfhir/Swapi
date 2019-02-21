import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SwapiResponse, Character, Film, Species } from '../models/swapi-responses.model';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export const SWAPI_URL = `https://swapi.co/api`;
export const endpoints = {
  people: `${SWAPI_URL}/people`,
  species: `${SWAPI_URL}/species`,
  films: `${SWAPI_URL}/films`
};

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  constructor(private http: HttpClient) {}

  getAllCharactersResponse(): Observable<SwapiResponse> {
    return this.http
      .get<SwapiResponse>(endpoints.people)
      .pipe
      // tap(_ => console.log(`calling ${endpoints.people}`))
      ();
  }

  getCharacterPage(url: string): Observable<SwapiResponse> {
    return this.http
      .get<SwapiResponse>(`${url}`)
      .pipe
      // tap(_ => console.log(`calling ${url}`))
      ();
  }

  getAllFilms(): Observable<Film[]> {
    return this.http.get<SwapiResponse>(endpoints.films).pipe(
      // tap(_ => console.log(`calling ${endpoints.films}`)),
      map(response => response.results as Array<Film>)
    );
  }

  getAllSpecies(): Observable<Species[]> {
    // TODO: Species are paginated, chain multiple calls
    return this.http.get<SwapiResponse>(endpoints.species).pipe(
      // tap(_ => console.log(`calling ${endpoints.species}`)),
      map(response => response.results as Array<Species>)
    );
  }
}