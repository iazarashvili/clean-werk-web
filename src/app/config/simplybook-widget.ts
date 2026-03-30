/**
 * SimplyBook v2 – volle iframe-URL aus dem Admin (Integration).
 * Basis-URL (Origin) wird für widget.js und SimplybookWidget genutzt.
 */
export const SIMPLYBOOK_IFRAME_URL: string | null =
  'https://rsp6520117175.simplybook.it/v2/?widget-type=iframe&theme=default&timeline=modern&datepicker=top_calendar';

/** Origin z. B. https://kunde.simplybook.it */
export function getSimplybookBaseUrl(fullWidgetUrl: string): string | null {
  try {
    return new URL(fullWidgetUrl.trim()).origin;
  } catch {
    return null;
  }
}

/**
 * Farben wie ein ruhiger Kalender: weiße Karte, Grautöne, blaue Links/Zeiten.
 * Für feinere Anpassung von .sb_time_slots_container: SimplyBook Admin → Custom CSS (Widget CSS).
 * Unsere App skaliert nur den sichtbaren Widget-Block (.sb-widget-compact in styles.css).
 */
export const SIMPLYBOOK_THEME_SETTINGS: Record<string, string | boolean | string[]> = {
  timeline_show_end_time: false,
  timeline_hide_unavailable: true,
  hide_past_days: false,
  hide_img_mode: true,
  show_sidebar: true,
  timeline_modern_display: 'as_slots',
  display_item_mode: 'block',
  sb_base_color: '#e8eaed',
  booking_nav_bg_color: '#ffffff',
  body_bg_color: '#ffffff',
  dark_font_color: '#1f2937',
  light_font_color: '#ffffff',
  btn_color_1: '#2563eb',
  sb_company_label_color: '#2563eb',
  sb_busy: '#e5e7eb',
  sb_available: '#dbeafe',
  sb_review_image: '',
  hide_company_label: false,
  link_color: '#2563eb',
};
