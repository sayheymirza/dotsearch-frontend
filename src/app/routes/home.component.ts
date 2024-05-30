import { Component } from '@angular/core';
import { SearchBarComponent } from '../components/search-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent],
  template: `
    <app-search-bar class="w-96"/>
  `,
  host: {
    class: 'flex flex-col items-center justify-center h-full'
  }
})
export class HomeComponent {

}
