import { type PropType, type UnwrapRef, computed, defineComponent, markRaw, toRef } from 'vue';
import { type UseFloatingOptions, autoUpdate, offset, useFloating } from 'vue-floating-ui';

describe('useFloating', () => {
  const FloatingSandbox = defineComponent({
    name: 'FloatingSandbox',

    props: {
      isReferenceVisible: {
        type: Boolean,
        default: true,
      },

      isFloatingVisible: {
        type: Boolean,
        default: true,
      },

      referenceType: {
        type: [String, Object],
        default: 'div',
      },

      floatingType: {
        type: [String, Object],
        default: 'div',
      },

      referenceSize: {
        type: Number,
        default: 50,
      },

      floatingSize: {
        type: Number,
        default: 50,
      },

      placement: {
        type: String as PropType<UnwrapRef<UseFloatingOptions['placement']>>,
        default: undefined,
      },

      strategy: {
        type: String as PropType<UnwrapRef<UseFloatingOptions['strategy']>>,
        default: undefined,
      },

      middleware: {
        type: Array as PropType<UnwrapRef<UseFloatingOptions['middleware']>>,
        default: undefined,
      },

      whileElementsMounted: {
        type: Function as PropType<UseFloatingOptions['whileElementsMounted']>,
        default: undefined,
      },
    },

    setup(props) {
      const { x, y, strategy, reference, floating, middlewareData, update } = useFloating({
        placement: toRef(props, 'placement'),
        strategy: toRef(props, 'strategy'),
        middleware: toRef(props, 'middleware'),
        whileElementsMounted: props.whileElementsMounted,
      });
      const referenceSize = toRef(props, 'referenceSize');
      const referenceWidth = computed(() => `${referenceSize.value}px`);
      const floatingSize = toRef(props, 'floatingSize');
      const floatingWidth = computed(() => `${floatingSize.value}px`);
      const floatingTop = computed(() => `${y.value ?? 0}px`);
      const floatingLeft = computed(() => `${x.value ?? 0}px`);
      const floatingMiddlewareData = computed(() => JSON.stringify(middlewareData.value));

      return {
        reference,
        referenceWidth,
        floating,
        floatingPosition: strategy,
        floatingWidth,
        floatingTop,
        floatingLeft,
        floatingMiddlewareData,
        update,
      };
    },

    template: /* HTML */ `
      <div>
        <component
          v-if="isReferenceVisible"
          ref="reference"
          :is="referenceType"
          :style="{
            aspectRatio: '1',
            backgroundColor: 'brown',
            width: referenceWidth,
          }"
        />
        <component
          v-if="isFloatingVisible"
          data-cy-floating
          ref="floating"
          :is="floatingType"
          :style="{
            aspectRatio: '1',
            backgroundColor: 'dimgrey',
            position: floatingPosition,
            width: floatingWidth,
            top: floatingTop,
            left: floatingLeft,
          }"
        />
        <div data-cy-floating-middleware-data :style="{ display: 'none' }">{{ floatingMiddlewareData }}</div>
      </div>
    `,
  });

  it('updates floating coords on placement change', () => {
    cy.mount(FloatingSandbox, { placement: 'bottom' })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px')
      .setProps({ placement: 'right' })
      .getByDataCy('floating')
      .should('have.css', 'top', '8px')
      .should('have.css', 'left', '58px');
  });

  it('updates floating coords on middleware change', () => {
    cy.mount(FloatingSandbox, { middleware: [] })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px')
      .setProps({ middleware: [offset(10)] })
      .getByDataCy('floating')
      .should('have.css', 'top', '68px')
      .should('have.css', 'left', '8px');
  });

  it('updates floating coords on reference size change when `autoUpdate` is provided', { retries: 5 }, () => {
    cy.mount(FloatingSandbox, { whileElementsMounted: autoUpdate })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px')
      .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
      .setProps({ referenceSize: 100 })
      .getByDataCy('floating')
      .should('have.css', 'top', '108px')
      .should('have.css', 'left', '33px');
  });

  it('updates floating coords on floating size change when `autoUpdate` is provided', { retries: 5 }, () => {
    cy.mount(FloatingSandbox, { whileElementsMounted: autoUpdate })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px')
      .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
      .setProps({ floatingSize: 25 })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '20.5px');
  });

  it('updates floating position on strategy change', () => {
    cy.mount(FloatingSandbox, { strategy: 'absolute' })
      .getByDataCy('floating')
      .should('have.css', 'position', 'absolute')
      .setProps({ strategy: 'fixed' })
      .getByDataCy('floating')
      .should('have.css', 'position', 'fixed');
  });

  it('fallbacks to default when placement becomes undefined', () => {
    cy.mount(FloatingSandbox, { placement: 'right' })
      .getByDataCy('floating')
      .should('have.css', 'top', '8px')
      .should('have.css', 'left', '58px')
      .setProps({ placement: undefined })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px');
  });

  it('fallbacks to default when strategy becomes undefined', () => {
    cy.mount(FloatingSandbox, { strategy: 'fixed' })
      .getByDataCy('floating')
      .should('have.css', 'position', 'fixed')
      .setProps({ strategy: undefined })
      .getByDataCy('floating')
      .should('have.css', 'position', 'absolute');
  });

  it('calls `whileElementsMounted` callback when reference and floating are mounted', () => {
    cy.mount(FloatingSandbox, { whileElementsMounted: cy.spy().as('whileElementsMounted') })
      .get('@whileElementsMounted')
      .should('have.callCount', 1);
  });

  it('does not call `whileElementsMounted` callback on reference change', () => {
    cy.mount(FloatingSandbox, { whileElementsMounted: cy.spy().as('whileElementsMounted') })
      .setProps({ referenceSize: 100 })
      .get('@whileElementsMounted')
      .should('have.callCount', 1);
  });

  it('does not call `whileElementsMounted` callback on floating change', () => {
    cy.mount(FloatingSandbox, { whileElementsMounted: cy.spy().as('whileElementsMounted') })
      .setProps({ floatingSize: 25 })
      .get('@whileElementsMounted')
      .should('have.callCount', 1);
  });

  it('does not call `whileElementsMounted` cleanup callback on reference change', () => {
    const cleanup = cy.spy().as('cleanup');

    cy.mount(FloatingSandbox, { whileElementsMounted: () => cleanup })
      .setProps({ referenceSize: 100 })
      .get('@cleanup')
      .should('have.callCount', 0);
  });

  it('does not call `whileElementsMounted` cleanup callback on floating change', () => {
    const cleanup = cy.spy().as('cleanup');

    cy.mount(FloatingSandbox, { whileElementsMounted: () => cleanup })
      .setProps({ floatingSize: 100 })
      .get('@cleanup')
      .should('have.callCount', 0);
  });

  it('calls `whileElementsMounted` cleanup callback on reference visibility change', () => {
    const cleanup = cy.spy().as('cleanup');

    cy.mount(FloatingSandbox, { whileElementsMounted: () => cleanup })
      .setProps({ isReferenceVisible: false })
      .get('@cleanup')
      .should('have.callCount', 1);
  });

  it('calls `whileElementsMounted` cleanup callback on floating visibility change', () => {
    const cleanup = cy.spy().as('cleanup');

    cy.mount(FloatingSandbox, { whileElementsMounted: () => cleanup })
      .setProps({ isFloatingVisible: false })
      .get('@cleanup')
      .should('have.callCount', 1);
  });

  it('calls `whileElementsMounted` cleanup callback on unmount', () => {
    const cleanup = cy.spy().as('cleanup');

    cy.mount(FloatingSandbox, { whileElementsMounted: () => cleanup })
      .unmount()
      .get('@cleanup')
      .should('have.callCount', 1);
  });

  it('calls `whileElementsMounted` cleanup callback on scope dispose', () => {
    const cleanup = cy.spy().as('cleanup');

    cy.mount(FloatingSandbox, { whileElementsMounted: () => cleanup })
      .getScope()
      .invoke('stop')
      .get('@cleanup')
      .should('have.callCount', 1);
  });

  it('assigns `middlewareData` without infinite loop', () => {
    cy.mount(FloatingSandbox, {
      middleware: [
        {
          name: 'middlewareData',
          fn() {
            return { data: { content: 'Floating UI is awesome!' } };
          },
        },
      ],
    })
      .getByDataCy('floating-middleware-data')
      .should('have.text', JSON.stringify({ middlewareData: { content: 'Floating UI is awesome!' } }));
  });

  it('updates floating when `update` function is called', { retries: 5 }, () => {
    cy.mount(FloatingSandbox)
      .then(() => Cypress.Promise.delay(100)) // we need to wait a little for `vue@^2`
      .getElement()
      .invoke('css', 'margin-top', '50px')
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px')
      .getComponent()
      .invoke('update')
      .getByDataCy('floating')
      .should('have.css', 'top', '100px')
      .should('have.css', 'left', '8px');
  });

  it('allows to use with virtual reference', () => {
    cy.mount(FloatingSandbox, { isReferenceVisible: false })
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .then(
        (component) =>
          void (component.reference = {
            getBoundingClientRect() {
              return {
                x: 8,
                y: 8,
                top: 8,
                left: 8,
                bottom: 58,
                right: 58,
                width: 50,
                height: 50,
              };
            },
          }),
      )
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px');
  });

  it('allows to use with component type reference', () => {
    cy.mount(FloatingSandbox, {
      referenceType: markRaw(
        defineComponent({
          name: 'FloatingReference',
          template: /* HTML */ `<div />`,
        }),
      ),
    })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px');
  });

  it('allows to use with component type floating', () => {
    cy.mount(FloatingSandbox, {
      floatingType: markRaw(
        defineComponent({
          name: 'FloatingFloating',
          template: /* HTML */ `<div />`,
        }),
      ),
    })
      .getByDataCy('floating')
      .should('have.css', 'top', '58px')
      .should('have.css', 'left', '8px');
  });
});
