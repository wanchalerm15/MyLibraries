import { Component, trigger, state, style, transition, animate, OnChanges, Input } from '@angular/core';
import { AlertService } from '../../services/alert.service';
@Component({
    selector: 'payan-alert',
    templateUrl: './alert-component.component.html',
    styleUrls: ['./alert-component.component.scss'],
    animations: [
        trigger("alert", [
            state("in", style({
                transform: "translateX(0)"
            })),
            transition("void => *", [
                style({
                    transform: "translateX(-100%)",
                    opacity: 1
                }),
                animate(300)
            ]),
            transition("* => void", [
                animate(200, style({
                    transform: "translateX(100%)",
                    opacity: 0
                }))
            ])
        ])
    ]
})
export class AlertComponentComponent {
    constructor(service: AlertService) {
        service.getNotificationErrors.subscribe(items => {
            this.items = items;
            if (this.items.length == 0) return;
            setTimeout(() => {
                this.items.splice(0, 1);
            }, this.timeout * 1000);
        });
    }
    private items: alertModel[];
    private timeout: number = 5;
}
export class alertModel {
    constructor(public type: string = null, public title: string = null, public content: string = null) { }
}
