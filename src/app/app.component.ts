import { Component, OnInit } from '@angular/core';
import { Observable, Subject, map, mergeMap, switchMap, take, tap, zip } from 'rxjs';

type Durum = ['flat bread', 'meat', 'sauce', 'tomato', 'cabbage'];
interface Order {
    amount: number;
    customerId: number;
}

interface Product {
    product: Durum,
    customerId: number
}

let flatBreadCounter = 0;
let meatCounter = 0;
let sauceCounter = 0;
let tomatoCounter = 0;
let cabbageCounter = 0;
let customerId = 0;

@Component({
    selector: 'app-root',
    template: `
    <button (click)="dispatchOrder()">Order Durum</button>
    <hr />
    <button (click)="_flatBread.next('flat bread')">Add Flat Bread</button>
    <button (click)="_meat.next('meat')">Add Meat</button>
    <button (click)="_sauce.next('sauce')">Add Sauce</button>
    <button (click)="_tomato.next('tomato')">Add Tomato</button>
    <button (click)="_cabbage.next('cabbage')">Add Cabbage</button>

    <ng-container *ngIf="delivery$ | async as product">
        <section *ngIf="product?.product">
            <h4>Enjoy</h4>
            <img src="" alt="">

            <h5>Ingredients:</h5>
            <pre>{{ product | json }}</pre>
        </section>
    </ng-container>
  `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'rxjs-learning-23';

    durum$: Observable<Durum>;
    delivery$: Observable<Product>;

    _flatBread = new Subject<'flat bread'>();
    _meat = new Subject<'meat'>();
    _sauce = new Subject<'sauce'>();
    _tomato = new Subject<'tomato'>();
    _cabbage = new Subject<'cabbage'>();

    _order = new Subject<Order>();

    constructor() {
        /**
         * zip(ob1, ob2, ...) waits for every observable to emit value
        */
        this.durum$ = zip(
            this._flatBread.pipe(map((ingredient) => `${ingredient}${++flatBreadCounter}`), tap(console.log)),
            this._meat.pipe(map((ingredient) => `${ingredient}${++meatCounter}`), tap(console.log)),
            this._sauce.pipe(map((ingredient) => `${ingredient}${++sauceCounter}`), tap(console.log)),
            this._tomato.pipe(map((ingredient) => `${ingredient}${++tomatoCounter}`), tap(console.log)),
            this._cabbage.pipe(map((ingredient) => `${ingredient}${++cabbageCounter}`), tap(console.log))
        ).pipe(
            tap((durum) => console.log('Enjoy!', durum))
        );

        /**
         * combineLatest([ob1, ob2, ob3, ...]) will waits for the first time, then emit when any observable emits the value
        */

        //  Start delivery stream
        this.delivery$ = this._order.pipe(
            tap((order: Order) => console.log('New Order: ', order)),
            // mergeMap((order) => this.durum$), // this will give error: Type 'Observable<Durum>' is not assignable to type 'Observable<Product>'
            switchMap(({ amount, customerId }) => // mainly used when HTTP calls are there, to close the already running call
            // mergeMap(({ amount, customerId }) =>
                this.durum$.pipe(
                    take(amount),
                    map((durum: Durum) => ({ product: durum, customerId }))
                )
            ),
            tap((product: Product) => console.log('Delivered product: ', product))
        );
    }

    ngOnInit(): void {

    }

    dispatchOrder (): void {
        const amount = 1 || Math.floor(Math.random() * 3) + 1;
        ++customerId;
        this._order.next({
            amount,
            customerId
        });
    }

}
