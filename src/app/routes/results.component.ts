import { NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormatPipe } from '../pipes/format.pipe';
import { ApiService } from '../services/api.service';
import { SearchBarComponent } from '../components/search-bar.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [FormatPipe, NgClass, SearchBarComponent],
  template: `
    <app-search-bar [value]="q" class="mx-4 md:mx-auto mt-10 md:container"/>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:container mx-4 md:mx-auto my-4">
      @for (item of data; track $index) {
        <a href="{{item['url']}}" target="_blank" class="flex flex-col gap-2 bg-white rounded-xl overflow-hidden p-4 h-96 transition-all hover:shadow-xl">
          <img src="{{item['data']['thumbnail']}}" alt="{{item['data']['name']}}" class="min-h-10 w-full object-cover object-center"/>

          <div class="flex flex-wrap gap-2">
            <span class="bg-gray-200 rounded-xl px-2 py-1 text-xs">
              {{ item['data']['brand']['name'] }}
            </span>

            <span class="bg-gray-200 rounded-xl px-2 py-1 text-xs">
              {{ item['data']['category']['name'] }}
            </span>
          </div>
          
          <strong class="mb-auto">{{item['data']['name']}}</strong>

          <div class="flex flex-nowrap items-end gap-1">
            <strong [ngClass]="{
              'line-through text-gray-400': item['data']['discount'] != 0
            }" class="text-emerald-600">{{ item['data']['price'] | format: 'price' }}</strong>
            <span [class.hidden]="item['data']['discount'] != 0" class="text-sm text-gray-400">{{ item['data']['currency'] | format: 'currency' }}</span>
            
            @if(item['data']['discount']) {
              <span class="bg-red-500 text-white rounded-xl text-xs px-2 py-1">{{item['data']['discount'] | format: 'price' }}%</span>
            }
          </div>

          @if(item['data']['discount']) {
            <div class="flex flex-nowrap items-end gap-1">
              <strong class="text-emerald-600 text-xl">{{ item['data']['price'] | format: 'discount': item['data']['discount'] | format: 'price' }}</strong>
              <span class="text-sm text-gray-400">{{ item['data']['currency'] | format: 'currency' }}</span>
            </div>
          }
        </a>
      }
    </div>
  `,
  host: {
    class: 'flex flex-col w-full min-h-full'
  }
})
export class ResultsComponent {
  public q: string = '';
  public page: number = 1;
  public limit: number = 20;
  public last: number = 1;
  public total: number = 0;
  public took: number = 0;
  public data: any[] = [];

  private loading: boolean = false;

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos >= max - 300) {
      this.next();
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      let { q, page } = params;

      let reset = this.q != q;

      this.page = page && !reset ? parseInt(page) : 1
      this.q = q ?? '';

      if (reset) {
        this.data = [];
      }

      this.search();

    });
  }

  public next() {
    if (this.loading == true && this.page + 1 > this.last) return;
    this.page += 1;
    this.search();
  }

  private async search() {
    try {
      if (this.loading == true) return;

      this.loading = true;
      const result = await this.apiService.search(this.q, this.page, this.limit);
      this.loading = false;

      if (result['status']) {
        this.page = result['meta']['page'];
        this.last = result['meta']['last'];
        this.total = result['meta']['total'];
        this.took = result['meta']['took'];
        this.data = this.data.concat(result['data']['hits']);
      }
    } catch (error) {
      //
    }
  }
}
