import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  menuOpen = false;

  /**
   * Logo: go to start page and scroll to top (same route still scrolls / clears hash).
   * Modifier / middle-click: default behavior (new tab etc.).
   */
  onBrandClick(event: MouseEvent): void {
    this.closeMenu();
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    void this.router.navigateByUrl('/').finally(() => {
      queueMicrotask(() => this.viewportScroller.scrollToPosition([0, 0]));
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }
}
