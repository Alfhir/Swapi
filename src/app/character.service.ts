import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SwapiResponse } from '../models/swapi-responses.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const SWAPI_URL = `https://swapi.co/api`;
export const endpoints = {
  people: `${SWAPI_URL}/people`
};

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private http: HttpClient) {}

  getAllCharacters(): Observable<SwapiResponse> {
    return this.http.get<SwapiResponse>(endpoints.people).pipe(
      tap(
        _ => console.log(`calling ${endpoints.people}`)
        // catch and replace
        // catchError(error => of([]))
      )
    );
  }
  getCharacters(query: string) {
    console.log(`calling ${query}`);
    return this.http.get<SwapiResponse>(`${query}`).pipe();
  }
}
