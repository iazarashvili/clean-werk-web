import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SimplybookEmbedComponent } from '../../shared/simplybook-embed/simplybook-embed.component';

@Component({
  selector: 'app-booking',
  imports: [RouterLink, SimplybookEmbedComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {}
