import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Order, Product, Status } from '@features/orders/models/order';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '@features/orders/services/order.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { TableModule, TablePageEvent } from 'primeng/table';
import { statuses } from '@features/orders/constants/status';
import { CookieService } from 'ngx-cookie-service';
import { token_cookie } from '@auth/constants';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, ReactiveFormsModule, Select, FloatLabel, InputText, Button, TableModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  standalone: true,
})
export class OrdersComponent implements OnInit {
  public orders: WritableSignal<Order[]> = signal<Order[]>([]);
  public products: Map<number, Product> = new Map<number, Product>();
  public pageSize: number = 10;
  public pageNum: number = 1;
  public filterForm!: FormGroup;
  public sortForm!: FormGroup;
  public statuses: Status[] = statuses;
  public totalSize: number = 0;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly orderService: OrderService = inject(OrderService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly cookiesService: CookieService = inject(CookieService);

  async ngOnInit(): Promise<void> {
    await this.initParams();
    await this.getList();
  }

  private async initParams(): Promise<void> {
    const params: Params = await firstValueFrom(this.route.queryParams);
    this.pageNum = params['pageNum'] ?? 1;
    this.pageSize = params['pageSize'] ?? 10;
    this.createForm(params);
  }

  private createForm(params: Params): void {
    this.filterForm = this.fb.group({
      status: [params['status'] ?? null],
      customerName: [params['customerName'] ?? null],
    });
    this.sortForm = this.fb.group({
      createdAt: [params['createdAt'] ?? null],
      total: [params['total'] ?? null],
    });
  }

  public async getList(): Promise<void> {
    this.products.clear();
    const [orders, totalSize] = await this.orderService.getList(
      this.filterForm.getRawValue(),
      this.sortForm.getRawValue(),
      this.pageSize,
      this.pageNum,
    );
    this.totalSize = totalSize;
    for (let order of orders) {
      for (let product of order.items) {
        if (this.products.get(product.productId) === undefined) {
          this.products.set(
            product.productId,
            await this.orderService.getProductById(product.productId),
          );
        }
      }
    }
    this.orders.update((): Order[] => orders);
    await this.router.navigate([], {
      queryParams: {
        ...this.filterForm.getRawValue(),
        ...this.sortForm.getRawValue(),
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      },
      queryParamsHandling: 'merge',
    });
  }

  public async openInfo(id: number): Promise<void> {
    await this.router.navigate(['', id]);
  }

  public getProductTitle(id: number): string {
    return this.products.get(id)?.title ?? '';
  }

  public async reset(): Promise<void> {
    this.filterForm.reset();
    await this.getList();
  }

  async pageChange(event: TablePageEvent): Promise<void> {
    this.pageNum = event.first / event.rows + 1;
    this.pageSize = event.rows;
    await this.getList();
  }

  async create(): Promise<void> {
    await this.router.navigate(['create']);
  }

  async logout(): Promise<void> {
    this.cookiesService.delete(token_cookie);
    await this.router.navigate(['login']);
  }
}
