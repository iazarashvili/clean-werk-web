import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  SIMPLYBOOK_IFRAME_URL,
  SIMPLYBOOK_THEME_SETTINGS,
  getSimplybookBaseUrl,
} from '../../config/simplybook-widget';

declare global {
  interface Window {
    SimplybookWidget?: new (config: Record<string, unknown>) => void;
  }
}

@Component({
  selector: 'app-simplybook-embed',
  imports: [RouterLink],
  templateUrl: './simplybook-embed.component.html',
})
export class SimplybookEmbedComponent implements AfterViewInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() showInternalBookingLink = true;

  readonly rawUrl = SIMPLYBOOK_IFRAME_URL?.trim() ?? null;

  /** Eindeutiger Container für SimplybookWidget */
  readonly containerId = `sbw_angular_${Math.random().toString(36).slice(2, 11)}`;

  /** Wenn Skript fehlschlägt: klassisches iframe mit gleicher URL */
  iframeFallbackSrc: SafeResourceUrl | null = null;

  private widgetStarted = false;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    if (!this.rawUrl || this.widgetStarted) {
      return;
    }
    const base = getSimplybookBaseUrl(this.rawUrl);
    if (!base) {
      this.useIframeFallback();
      return;
    }
    this.widgetStarted = true;
    this.loadWidgetScript(`${base}/v2/widget/widget.js`)
      .then(() => {
        const Ctor = window.SimplybookWidget;
        if (!Ctor) {
          this.useIframeFallback();
          return;
        }
        new Ctor({
          widget_type: 'iframe',
          url: base,
          theme: 'default',
          theme_settings: { ...SIMPLYBOOK_THEME_SETTINGS },
          timeline: 'modern',
          datepicker: 'top_calendar',
          is_rtl: '',
          container_id: this.containerId,
          app_config: {
            clear_session: '1',
            allow_switch_to_ada: '',
            predefined: [],
          },
        });
        this.fallbackTimer = setTimeout(() => {
          const el = document.getElementById(this.containerId);
          if (el && el.querySelector('iframe') === null) {
            this.useIframeFallback();
          }
        }, 12000);
      })
      .catch(() => this.useIframeFallback());
  }

  ngOnDestroy(): void {
    if (this.fallbackTimer !== null) {
      clearTimeout(this.fallbackTimer);
    }
  }

  private useIframeFallback(): void {
    if (this.fallbackTimer !== null) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (!this.rawUrl) {
      return;
    }
    this.iframeFallbackSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
    this.cdr.markForCheck();
  }

  private loadWidgetScript(src: string): Promise<void> {
    if (window.SimplybookWidget) {
      return Promise.resolve();
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      return new Promise((resolve, reject) => {
        const deadline = Date.now() + 10000;
        const id = window.setInterval(() => {
          if (window.SimplybookWidget) {
            window.clearInterval(id);
            resolve();
          } else if (Date.now() > deadline) {
            window.clearInterval(id);
            reject(new Error('SimplyBook widget API timeout'));
          }
        }, 40);
      });
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('SimplyBook script load failed'));
      document.body.appendChild(s);
    });
  }
}
