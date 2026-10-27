import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DailyTotal } from '../../models';
import { EurosPipe } from '../../shared/euro.pipe';

@Component({
  selector: 'app-daily-totals',
  imports: [DatePipe, EurosPipe],
  templateUrl: './daily-totals.html',
  styleUrl: './daily-totals.css',
})
export class DailyTotals {
  readonly totals = input.required<DailyTotal[]>();
  readonly today = input.required<string>();
}
