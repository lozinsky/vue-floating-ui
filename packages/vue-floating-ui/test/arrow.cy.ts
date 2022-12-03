import { computed, defineComponent, markRaw, ref, toRef } from 'vue-demi';
import {
  type FloatingElement,
  type Placement,
  type ReferenceElement,
  type Side,
  arrow,
  autoUpdate,
  useFloating,
} from 'vue-floating-ui';

describe('arrow', () => {
  type FloatingSandboxProps<T extends ReferenceElement = ReferenceElement> = {
    referenceSize?: number;
    floatingSize?: number;
    floatingArrowType?: unknown;
    floatingArrowPadding?: number;
    placement?: Placement;
    whileElementsMounted?: (reference: T, floating: FloatingElement, update: () => void) => void | (() => void);
  };

  const FloatingSandbox = defineComponent({
    name: 'FloatingSandbox',
    props: [
      'referenceSize',
      'floatingSize',
      'floatingArrowType',
      'floatingArrowPadding',
      'placement',
      'whileElementsMounted',
    ],
    setup(props: FloatingSandboxProps) {
      const OPPOSITE_SIDE_BY_SIDE: Record<Side, Side> = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      };

      const reference = ref<ReferenceElement | null>(null);
      const floating = ref<FloatingElement | null>(null);
      const floatingArrow = ref<HTMLElement | null>(null);
      const { x, y, strategy, placement, middlewareData } = useFloating(reference, floating, {
        placement: toRef(props, 'placement'),
        middleware: [arrow({ element: floatingArrow, padding: props.floatingArrowPadding })],
        whileElementsMounted: props.whileElementsMounted,
      });
      const side = computed(() => placement.value.split('-')[0] as Side);
      const referenceSize = toRef(props, 'referenceSize');
      const referenceWidth = computed(() => `${referenceSize.value ?? 50}px`);
      const floatingSize = toRef(props, 'floatingSize');
      const floatingWidth = computed(() => `${floatingSize.value ?? 50}px`);
      const floatingTop = computed(() => `${y.value ?? 0}px`);
      const floatingLeft = computed(() => `${x.value ?? 0}px`);
      const floatingArrowTop = computed(() => `${middlewareData.value.arrow?.y ?? 0}px`);
      const floatingArrowLeft = computed(() => `${middlewareData.value.arrow?.x ?? 0}px`);
      const floatingArrowBalance = computed(() => ({ [OPPOSITE_SIDE_BY_SIDE[side.value]]: '-4px' }));

      return {
        reference,
        referenceWidth,
        floating,
        floatingPosition: strategy,
        floatingWidth,
        floatingTop,
        floatingLeft,
        floatingArrow,
        floatingArrowTop,
        floatingArrowLeft,
        floatingArrowBalance,
      };
    },
    template: /* HTML */ `
      <div>
        <div
          ref="reference"
          :style="{
            aspectRatio: '1',
            backgroundColor: 'brown',
            width: referenceWidth,
          }"
        />
        <div
          ref="floating"
          :style="{
            aspectRatio: '1',
            backgroundColor: 'dimgrey',
            position: floatingPosition,
            width: floatingWidth,
            top: floatingTop,
            left: floatingLeft,
          }"
        >
          <component
            data-cy-floating-arrow
            ref="floatingArrow"
            :is="floatingArrowType ?? 'div'"
            :style="{
              position: 'absolute',
              backgroundColor: 'darkslateblue',
              width: '8px',
              height: '8px',
              transform: 'rotate(45deg)',
              top: floatingArrowTop,
              left: floatingArrowLeft,
              ...floatingArrowBalance,
            }"
          />
        </div>
      </div>
    `,
  });

  it('updates arrow coords on placement change', () => {
    cy.mount(FloatingSandbox, { placement: 'bottom' })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '-4px')
      .should('have.css', 'left', '21px')
      .setProps({ placement: 'right' })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '21px')
      .should('have.css', 'left', '-4px');
  });

  it('does not update arrow coords on reference size change when `autoUpdate` is provided', { retries: 5 }, () => {
    cy.mount(FloatingSandbox, { whileElementsMounted: autoUpdate })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '-4px')
      .should('have.css', 'left', '21px')
      .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
      .setProps({ referenceSize: 100 })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '-4px')
      .should('have.css', 'left', '21px');
  });

  it('updates arrow coords on floating size change when `autoUpdate` is provided', { retries: 5 }, () => {
    cy.mount(FloatingSandbox, { whileElementsMounted: autoUpdate })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '-4px')
      .should('have.css', 'left', '21px')
      .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
      .setProps({ floatingSize: 25 })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '-4px')
      .should('have.css', 'left', '8.5px');
  });

  it('works with alignment placement', () => {
    cy.mount(FloatingSandbox, { placement: 'right-end', floatingSize: 25 })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '0px')
      .should('have.css', 'left', '-4px');
  });

  it('works with alignment placement and with padding', () => {
    cy.mount(FloatingSandbox, { placement: 'right-end', floatingSize: 25, floatingArrowPadding: 4 })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '4px')
      .should('have.css', 'left', '-4px');
  });

  it('allows to use with component type arrow', () => {
    cy.mount(FloatingSandbox, {
      floatingArrowType: markRaw(
        defineComponent({
          name: 'UseFloatingArrow',
          template: /* HTML */ `<div></div>`,
        }),
      ),
    })
      .getByDataCy('floating-arrow')
      .should('have.css', 'top', '-4px')
      .should('have.css', 'left', '21px');
  });
});
