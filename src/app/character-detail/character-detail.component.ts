import { Component, OnInit, OnDestroy } from '@angular/core';
import { Character } from 'src/models/swapi-responses.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwapiService } from '../swapi.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'swapi-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  character: Character;
  _subscription;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private swapiService: SwapiService
  ) {
    this.route.params.subscribe();
  }
  ngOnInit(): void {
    this.getCharacter();
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  // TODO: If someone deep links here, service is not available yet
  getCharacter(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this._subscription = this.swapiService
      .getCharacter(id)
      .pipe(take(1))
      .subscribe(
        c => {
          this.character = c;
        },
        err => console.log(err),
        () => {} // TODO Log success on level debug
      );
  }
  goBack(): void {
    this.location.back();
  }
}
