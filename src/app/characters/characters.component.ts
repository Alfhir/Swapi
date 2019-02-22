import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwapiService } from '../swapi.service';
import { Character } from '../../models/swapi-responses.model';
import { FilterService } from '../filter.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'swapi-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  _subscription;

  constructor(private swapiService: SwapiService, private filterService: FilterService) {}

  ngOnInit() {
    this._subscription = this.swapiService.characters.subscribe(
      characters => (this.characters = characters)
    );
    this.filterService.filteredCharacterUrlStream.subscribe(stream => {
      console.log(`filter returns: ${JSON.stringify(stream)}`);
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
