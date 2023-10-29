import { Component, OnInit } from '@angular/core';
import { Observable, Subject, map, tap, zip } from 'rxjs';

type Durum = ['flat bread', 'meat', 'sauce', 'tomato', 'cabbage'];
interface Order {
    amount: number;
    customerId: number;
}

let flatBreadCounter = 0;
let meatCounter = 0;
let sauceCounter = 0;
let tomatoCounter = 0;
let cabbageCounter = 0;

@Component({
    selector: 'app-root',
    template: `
    <button (click)="_flatBread.next('flat bread')">Add Flat Bread</button>
    <button (click)="_meat.next('meat')">Add Meat</button>
    <button (click)="_sauce.next('sauce')">Add Sauce</button>
    <button (click)="_tomato.next('tomato')">Add Tomato</button>
    <button (click)="_cabbage.next('cabbage')">Add Cabbage</button>

    <ng-container *ngIf="durum$ | async as durum">
        <section *ngIf="durum?.length">
            <h4>Enjoy</h4>
            <img src="" alt="">

            <h5>Ingredients:</h5>
            <pre>{{ durum | json }}</pre>
        </section>
    </ng-container>
  `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'rxjs-learning-23';

    durum$: Observable<Durum>;

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
    }

    ngOnInit(): void {

    }

}
