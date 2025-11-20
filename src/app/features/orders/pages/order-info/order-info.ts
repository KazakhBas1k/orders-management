import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Order, Product, ProductItem } from '@features/orders/models/order';
import { OrderService } from '@features/orders/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-order-info',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './order-info.html',
  styleUrl: './order-info.scss',
  standalone: true,
})
export class OrderInfo implements OnInit {
  public orderForm!: FormGroup;
  public itemForm!: FormGroup;
  public orderInfo: WritableSignal<Order | null> = signal<Order | null>(null);
  public items: WritableSignal<ProductItem[]> = signal<ProductItem[]>([]);
  public products: WritableSignal<Product[]> = signal<Product[]>([]);
  public qty: number = 0;
  public productId: string = '';
  public id: number = 0;

  private readonly orderService: OrderService = inject(OrderService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);

  async ngOnInit(): Promise<void> {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      const orderInfo: Order = await this.orderService.getOrderById(+id);
      this.orderInfo.update((): Order => orderInfo);
      this.createForm();
      this.items.update((): ProductItem[] => orderInfo.items);
    }
    const products: Product[] = await this.orderService.getProductList();
    this.products.update((): Product[] => products);
  }

  private createForm(): void {
    this.orderForm = this.fb.group({
      number: [this.orderInfo()?.number ?? null, [Validators.required]],
      customerName: [this.orderInfo()?.customerName ?? null, [Validators.required]],
      status: [this.orderInfo()?.status ?? null, [Validators.required]],
      total: [this.orderInfo()?.total ?? null, [Validators.required]],
    });
    this.itemForm = this.fb.group({
      productId: [null, [Validators.required]],
      qty: [null, [Validators.required]],
    });
  }

  public addItem(): void {
    if (this.itemForm.invalid) {
      this.toastService.add('Ошибка', 'Все поля должны быть заполнены', 'error');
    } else {
      this.items.update((items: ProductItem[]) => {
        if (items.find((i) => i.productId === +this.productId)) {
          return items.map((i) =>
            i.productId === +this.productId ? { ...i, qty: i.qty + this.qty } : i,
          );
        } else {
          return [
            ...items,
            {
              productId: +this.productId,
              qty: this.qty,
              price: this.products().find((p) => +p.id === +this.productId)?.price ?? 0,
            },
          ];
        }
      });
    }
    this.calcTotal();
  }

  public removeItem(id: number): void {
    this.items.update((items) => items.filter((i) => i.productId !== id));
    this.calcTotal();
  }

  public async save(): Promise<void> {
    if (this.orderForm.invalid) {
      this.toastService.add('Ошибка', 'Все поля должны быть заполнены', 'error');
    } else {
      await this.orderService.update(this.id, {
        id: this.id,
        ...this.orderForm.getRawValue(),
        items: this.items(),
      });
    }
  }

  public getProductNameById(id: number): string {
    return this.products().find((product: Product): boolean => +product.id === id)?.title ?? '';
  }

  public calcTotal(): void {
    this.orderForm.get('total')?.setValue(this.items().reduce((c, i) => i.price * i.qty + c, 0));
  }

  public async delete(): Promise<void> {
    await this.orderService.delete(this.id);
    await this.router.navigate(['']);
  }
}
