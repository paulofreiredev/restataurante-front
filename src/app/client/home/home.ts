import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { Header } from '../../header/header';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatGridListModule, Header],
  changeDetection: ChangeDetectionStrategy.OnPush,  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
