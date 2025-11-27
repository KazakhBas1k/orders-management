import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order, OrderFilter, OrderSort, Product } from '@features/orders/models/order';
import { firstValueFrom, forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _urlPrefix: string = 'http://localhost:3000';

  private readonly http: HttpClient = inject(HttpClient);

  public async getList(
    filter: OrderFilter,
    sort: OrderSort,
    pageSize: number,
    pageNum: number,
  ): Promise<[Order[], number]> {
    let params: HttpParams = new HttpParams({
      fromObject: { _page: pageNum, _limit: pageSize },
    });
    if (filter.status !== null) {
      params = params.append('status', filter.status);
    }
    if (filter.customerName !== null) {
      params = params.append('customerName', filter.customerName);
    }
    if (sort.createdAt !== null) {
      params = params.append('_sort', 'createdAt');
      params = params.append('_order', sort.createdAt);
    }
    if (sort.total !== null) {
      params = params.append('_sort', 'total');
      params = params.append('_order', sort.total);
    }
    return await firstValueFrom(
      forkJoin([
        this.http.get<Order[]>(`${this._urlPrefix}/orders`, { params }),
        this.http
          .get<Order[]>(`${this._urlPrefix}/orders`)
          .pipe(map((orders: Order[]): number => orders.length)),
      ]),
    );
  }

  public async getProductById(id: number): Promise<Product> {
    const params: HttpParams = new HttpParams({
      fromObject: { id },
    });
    return await firstValueFrom(
      this.http
        .get<Product[]>(`${this._urlPrefix}/products`, { params })
        .pipe(map((products: Product[]): Product => products[0])),
    );
  }

  public async getProductList(): Promise<Product[]> {
    return await firstValueFrom(this.http.get<Product[]>(`${this._urlPrefix}/products`));
  }

  public async getOrderById(id: number): Promise<Order> {
    const params: HttpParams = new HttpParams({ fromObject: { id } });
    return await firstValueFrom(
      this.http
        .get<Order[]>(`${this._urlPrefix}/orders`, { params })
        .pipe(map((orders: Order[]): Order => orders[0])),
    );
  }

  public async create(body: Order): Promise<void> {
    return await firstValueFrom(this.http.post<void>(`${this._urlPrefix}/orders`, body));
  }

  public async update(id: number, order: Order): Promise<void> {
    return await firstValueFrom(this.http.put<void>(`${this._urlPrefix}/orders/${id}`, order));
  }

  public async delete(id: number): Promise<void> {
    return await firstValueFrom(this.http.delete<void>(`${this._urlPrefix}/orders/${id}`));
  }
}
