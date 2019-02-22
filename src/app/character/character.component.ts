import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Character } from 'src/models/swapi-responses.model';

@Component({
  selector: 'swapi-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterComponent {
  @Input() char: Character;
}
