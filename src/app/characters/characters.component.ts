import { Component, OnInit, OnDestroy } from '@angular/core';
import { CharacterService } from '../character.service';

import { SwapiResponse } from '../../models/swapi-responses.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'swapi-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit, OnDestroy {
  response: SwapiResponse;
  subscription: Subscription;

  constructor(private characterService: CharacterService) {}

  ngOnInit() {
    this.subscription = this.characterService
      .getAllCharacters()
      .subscribe(response => (this.response = response));
  }

  previousPage(previousURL: string) {
    if (previousURL) {
      console.log('fetching previous page');
      this.subscription.unsubscribe();
      this.subscription = this.characterService
        .getCharacters(previousURL)
        .subscribe(
          res => (this.response = res),
          err => console.error(),
          () => console.log('HTTP request completed')
        );
    }
  }

  nextPage(nextURL: string) {
    if (nextURL) {
      console.log('fetching next page');
      this.subscription.unsubscribe();
      this.subscription = this.characterService
        .getCharacters(nextURL)
        .subscribe(
          res => (this.response = res),
          err => console.error(),
          () => console.log('HTTP request completed')
        );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
