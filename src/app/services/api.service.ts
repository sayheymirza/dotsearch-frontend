import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public search(q: string, page: number = 1, limit: number = 10) {
    return lastValueFrom<any>(
      this.httpClient.post(`https://api.ohmyapi.com/v1/call/api.v1.digikala.products`, {
        q,
        page,
        limit
      })
    );
  }
}
