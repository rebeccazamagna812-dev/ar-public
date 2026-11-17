import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * .[base] Brand Symbol (type=CAIXA) — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → Header / Footer → .[base] Brand Symbol, 71×16]
 */
@Component({
  selector: 'dsc-brand-symbol',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'img', 'aria-label': 'CAIXA' },
  template: `
    <svg viewBox="0 0 71 16" width="71" height="16" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
      <path class="accent" d="M35.498 15.7631H42.2176L49.5814 8.38818H42.8619L35.498 15.7631Z" />
      <path class="accent" d="M50.9768 0.262207L48.0625 3.18092L50.3275 7.63713L57.6913 0.262207H50.9768Z" />
      <path d="M32.1106 0.262207H37.7328L35.2766 15.7632H29.6543L32.1106 0.262207Z" />
      <path d="M22.1089 10.1576L21.8371 7.31955C21.7717 6.6491 21.8019 5.64091 21.8119 4.92005H21.5804L19.6577 10.1576H22.0686H22.1089ZM17.4581 15.7632H11.5137L19.3406 0.262207H25.5568L28.6372 15.7632H22.6777L22.4663 13.8274H18.2181L17.4581 15.7632Z" />
      <path d="M39.8574 0.262207H46.577L50.3268 7.63713H43.6123L39.8574 0.262207Z" />
      <path d="M64.1432 10.1576L63.8664 7.31955C63.801 6.6491 63.8312 5.64091 63.8412 4.92005H63.6147L61.687 10.1576H64.0979H64.1432ZM59.4874 15.7632H53.543L61.3699 0.262207H67.5861L70.6665 15.7632H64.707L64.4956 13.8274H60.2474L59.4874 15.7632Z" />
      <path d="M12.3803 6.53812C11.6152 5.70132 10.5934 4.98047 9.325 4.98047C7.64386 4.98047 6.05835 6.31632 5.78654 8C5.52481 9.70888 6.77308 11.0195 8.45423 11.0195C9.7478 11.0195 10.8602 10.4701 11.9071 9.58286L10.8199 15.39C9.84847 15.8135 7.72942 16 6.71772 16C2.30849 16 -0.595764 12.5671 0.103874 8.15123C0.813578 3.61941 4.94094 0 9.476 0C10.7444 0 12.0279 0.236925 13.1504 0.635161L12.3803 6.53812Z" />
      <path d="M45.127 12.8444L49.5815 8.38818L53.3313 15.7631H46.6118L45.127 12.8444Z" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }
    path {
      fill: var(--dsc-color-bg-highlight-5);
      fill-rule: evenodd;
    }
    path.accent {
      fill: var(--dsc-color-bg-accent-4);
    }
  `,
})
export class DscBrandSymbol {}
