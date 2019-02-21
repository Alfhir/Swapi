import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SwapiService } from '../swapi.service';

import { SwapiResponse, Character } from '../../models/swapi-responses.model';
import { Subscription, fromEvent } from 'rxjs';
import { exhaustMap, tap } from 'rxjs/operators';

@Component({
  selector: 'swapi-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit, OnDestroy, AfterViewInit {
  response: SwapiResponse;
  characters: Character[];
  subscription: Subscription;
  @ViewChild('prevPageButton') previousPageButton: ElementRef;
  @ViewChild('nextPageButton') nextPageButton: ElementRef;

  constructor(private swapiService: SwapiService) {}

  ngOnInit() {
    this.subscription = this.swapiService.getAllCharactersResponse().subscribe(response => {
      this.response = response;
      this.characters = response.results as Character[];
    });
  }
  ngAfterViewInit() {
    console.log('view initialized');
    this.bindButtonClickstreamToServiceCall(
      this.previousPageButton.nativeElement,
      this.response.previous
    );
    this.bindButtonClickstreamToServiceCall(this.nextPageButton.nativeElement, this.response.next);
  }
  bindButtonClickstreamToServiceCall(btn: any, url: string) {
    fromEvent(btn, 'click')
      .pipe(
        tap(_ => console.log('prev page btn clicked')),
        // stop incessant clickers from triggering multiple http-calls
        exhaustMap(() => this.swapiService.getCharacterPage(url))
      )
      .subscribe(
        response => {
          this.response = response;
          this.characters = response.results as Character[];
        },
        err => console.error()
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
