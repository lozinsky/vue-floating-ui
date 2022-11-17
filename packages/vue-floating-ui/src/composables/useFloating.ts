import {
  type FloatingElement,
  type Middleware,
  type MiddlewareData,
  type Placement,
  type ReferenceElement,
  type Strategy,
  computePosition,
} from '@floating-ui/dom';
import {
  type Ref,
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  shallowReadonly,
  shallowRef,
  unref,
  watch,
} from 'vue-demi';

import type { MaybeElement, MaybeReadonlyRef } from '../types';
import { unwrapElement } from '../utils/unwrapElement';

export type UseFloatingOptions<T extends ReferenceElement = ReferenceElement> = {
  /**
   * Where to place the floating element relative to its reference element.
   *
   * @default 'bottom'
   */
  placement?: MaybeReadonlyRef<Placement | undefined>;
  /**
   * The type of CSS position property to use.
   *
   * @default 'absolute'
   */
  strategy?: MaybeReadonlyRef<Strategy | undefined>;
  /**
   * These are plain objects that modify the positioning coordinates in some fashion, or provide useful data for the consumer to use.
   *
   * @default undefined
   */
  middleware?: MaybeReadonlyRef<Middleware[] | undefined>;
  /**
   * Callback to handle mounting/unmounting of the elements.
   *
   * @default undefined
   */
  whileElementsMounted?: (reference: T, floating: FloatingElement, update: () => void) => void | (() => void);
};

export type UseFloatingReturn = {
  /**
   * The x-coord of the floating element.
   */
  x: Readonly<Ref<number | null>>;
  /**
   * The y-coord of the floating element.
   */
  y: Readonly<Ref<number | null>>;
  /**
   * The stateful placement, which can be different from the initial `placement` passed as options.
   */
  placement: Readonly<Ref<Placement>>;
  /**
   * The type of CSS position property to use.
   */
  strategy: Readonly<Ref<Strategy>>;
  /**
   * Additional data from middleware.
   */
  middlewareData: Readonly<Ref<MiddlewareData>>;
  /**
   * The function to update floating position manually.
   */
  update: () => void;
};

/**
 * Computes the `x` and `y` coordinates that will place the floating element next to a reference element when it is given a certain CSS positioning strategy.
 *
 * @param reference The reference template ref.
 * @param floating The floating template ref.
 * @param options The floating options.
 *
 * @see https://github.com/lozinsky/vue-floating-ui/blob/main/packages/vue-floating-ui/README.md
 */
export function useFloating<T extends ReferenceElement = ReferenceElement>(
  reference: Readonly<Ref<MaybeElement<T>>>,
  floating: Readonly<Ref<MaybeElement<FloatingElement>>>,
  options: UseFloatingOptions<T> = {},
): UseFloatingReturn {
  const whileElementsMountedOption = options.whileElementsMounted;
  const middlewareOption = computed(() => unref(options.middleware));
  const placementOption = computed(() => unref(options.placement) ?? 'bottom');
  const strategyOption = computed(() => unref(options.strategy) ?? 'absolute');
  const referenceElement = computed(() => unwrapElement(reference.value));
  const floatingElement = computed(() => unwrapElement(floating.value));
  const x = ref<number | null>(null);
  const y = ref<number | null>(null);
  const strategy = ref(strategyOption.value);
  const placement = ref(placementOption.value);
  const middlewareData = shallowRef<MiddlewareData>({});

  let whileElementsMountedCleanup: void | (() => void);

  function update() {
    if (referenceElement.value == null || floatingElement.value == null) {
      return;
    }

    computePosition(referenceElement.value, floatingElement.value, {
      middleware: middlewareOption.value,
      placement: placementOption.value,
      strategy: strategyOption.value,
    }).then((position) => {
      x.value = position.x;
      y.value = position.y;
      strategy.value = position.strategy;
      placement.value = position.placement;
      middlewareData.value = position.middlewareData;
    });
  }

  function cleanup() {
    if (typeof whileElementsMountedCleanup === 'function') {
      whileElementsMountedCleanup();
      whileElementsMountedCleanup = undefined;
    }
  }

  function attach() {
    cleanup();

    if (whileElementsMountedOption === undefined) {
      update();
      return;
    }

    if (referenceElement.value != null && floatingElement.value != null) {
      whileElementsMountedCleanup = whileElementsMountedOption(referenceElement.value, floatingElement.value, update);
      return;
    }
  }

  watch([middlewareOption, placementOption, strategyOption], update, { flush: 'sync' });
  watch([referenceElement, floatingElement], attach, { flush: 'sync' });

  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }

  return {
    x: shallowReadonly(x),
    y: shallowReadonly(y),
    strategy: shallowReadonly(strategy),
    placement: shallowReadonly(placement),
    middlewareData: shallowReadonly(middlewareData),
    update,
  };
}
