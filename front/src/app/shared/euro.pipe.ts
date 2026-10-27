import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'euros',
})
export class EurosPipe implements PipeTransform {
    transform(cents: number): string {
        return (cents / 100).toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        });
    }
}