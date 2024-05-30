import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <span class="material-icons-round text-gray-500">
      search
    </span>

    <input [(ngModel)]="value" (keyup.enter)="submit()" type="text" placeholder="دنبال چی هستی" class="w-full h-full bg-transparent placeholder:text-gray-500 outline-none" />
  `,
  host: {
    class: 'bg-white shadow-inner h-12 rounded-2xl px-4 flex flex-nowrap items-center gap-2'
  }
})
export class SearchBarComponent {
  @Input()
  public value: string = '';

  constructor(private router: Router) { }

  public submit() {
    if (this.value.length > 2) {
      this.router.navigate(['/search'], {
        queryParams: {
          q: this.value,
          page: 1
        }
      });
    }
  }
}
