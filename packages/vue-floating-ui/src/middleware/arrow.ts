import { type Middleware, type Padding, arrow as apply } from '@floating-ui/dom';
import { unref } from 'vue-demi';

import type { MaybeElement, MaybeReadonlyRef } from '../types';
import { unwrapElement } from '../utils/unwrapElement';

export type ArrowOptions = {
  /**
   * The arrow element or template ref to be positioned.
   *
   * @required
   */
  element: MaybeReadonlyRef<MaybeElement<HTMLElement>>;
  /**
   * The padding between the arrow element and the floating element edges. Useful when the floating element has rounded corners.
   *
   * @default 0
   */
  padding?: Padding;
};

/**
 * Positions an inner element of the floating element such that it is centered to the reference element.
 *
 * @param options The arrow options.
 *
 * @see https://github.com/lozinsky/vue-floating-ui/blob/main/packages/vue-floating-ui/README.md#arrow
 */
export function arrow(options: ArrowOptions): Middleware {
  return {
    name: 'arrow',
    options,
    fn(args) {
      const element = unwrapElement(unref(options.element));

      if (element == null) {
        return {};
      }

      return apply({ element, padding: options.padding }).fn(args);
    },
  };
}
