import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimplybookEmbedComponent } from '../../shared/simplybook-embed/simplybook-embed.component';

export interface HomeServiceItem {
  readonly id: 'office' | 'building' | 'hotel' | 'apartment' | 'special' | 'maintenance';
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, ReactiveFormsModule, SimplybookEmbedComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly fb = inject(FormBuilder);

  readonly services: HomeServiceItem[] = [
    {
      id: 'office',
      title: 'Büroreinigung',
      description:
        'Regelmäßige oder einmalige Reinigung Ihrer Büroräume – für eine gepflegte Arbeitsatmosphäre und hygienische Oberflächen.',
    },
    {
      id: 'building',
      title: 'Gebäudereinigung',
      description:
        'Treppenhäuser, Eingänge und Gemeinschaftsflächen zuverlässig reinigen – abgestimmt auf Ihr Objekt und die Nutzungszeiten.',
    },
    {
      id: 'hotel',
      title: 'Hotelreinigung',
      description:
        'Diskrete, gründliche Zimmer- und Bereichsreinigung mit Fokus auf Gästekomfort und einheitliche Qualitätsstandards.',
    },
    {
      id: 'apartment',
      title: 'Wohnungsreinigung',
      description:
        'Ihr Zuhause als Rückzugsort: wir reinigen gründlich und schonend – ideal nach Umzug, Renovierung oder für regelmäßige Pflege.',
    },
    {
      id: 'special',
      title: 'Spezial- & Tiefenreinigung',
      description:
        'Intensive Reinigung für hartnäckige Verschmutzungen, Sanitär- und Küchenbereiche – mit geeigneten Mitteln und geschultem Personal.',
    },
    {
      id: 'maintenance',
      title: 'Unterhaltsreinigung',
      description:
        'Feste Rhythmen und klare Checklisten: wir halten Ihre Räume dauerhaft in einem gepflegten Zustand – ohne Überraschungen.',
    },
  ];

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', [Validators.maxLength(4000)]],
  });

  contactSubmitSuccess = false;

  onContactSubmit(): void {
    this.contactSubmitSuccess = false;
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    // Hier später an Backend / E-Mail-Service anbinden
    this.contactSubmitSuccess = true;
    this.contactForm.reset();
  }

  fieldError(field: 'name' | 'email' | 'subject' | 'message'): string | null {
    const c = this.contactForm.get(field);
    if (!c || !c.touched || !c.errors) {
      return null;
    }
    if (c.errors['required']) {
      return 'Dieses Feld ist erforderlich.';
    }
    if (c.errors['email']) {
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }
    if (c.errors['maxlength']) {
      return 'Die Eingabe ist zu lang.';
    }
    return null;
  }
}
