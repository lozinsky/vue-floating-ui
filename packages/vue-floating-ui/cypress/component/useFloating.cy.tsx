import { type DefineComponent, defineComponent, reactive, ref } from 'vue';
import {
  type Middleware,
  type Placement,
  type Strategy,
  type UseFloatingOptions,
  autoUpdate,
  offset,
  useFloating,
} from 'vue-floating-ui';

describe('useFloating', () => {
  type Components = {
    UseFloatingReference: string | DefineComponent;
    UseFloatingFloating: string | DefineComponent;
  };

  function setup(options?: UseFloatingOptions) {
    const reference = reactive({ size: 50, isVisible: true });
    const floating = reactive({ size: 50, isVisible: true });
    const components: Components = { UseFloatingReference: 'div', UseFloatingFloating: 'div' };
    const UseFloating = defineComponent({
      name: 'UseFloating',

      setup() {
        return useFloating(options);
      },

      render() {
        const { UseFloatingReference, UseFloatingFloating } = components;

        return (
          <>
            {reference.isVisible && (
              <UseFloatingReference
                ref='reference'
                style={{
                  aspectRatio: '1',
                  backgroundColor: 'brown',
                  width: `${reference.size}px`,
                }}
              />
            )}
            {floating.isVisible && (
              <UseFloatingFloating
                data-cy-floating
                ref='floating'
                style={{
                  aspectRatio: '1',
                  backgroundColor: 'dimgrey',
                  width: `${floating.size}px`,
                  position: this.strategy,
                  top: `${this.y ?? 0}px`,
                  left: `${this.x ?? 0}px`,
                }}
              />
            )}
            <div data-cy-middleware-data style={{ display: 'none' }}>
              {JSON.stringify(this.middlewareData)}
            </div>
          </>
        );
      },
    });

    return { UseFloating, reference, floating, components };
  }

  it('updates floating coords on placement change', () => {
    const placement = ref<Placement>('bottom');
    const { UseFloating } = setup({ placement });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating')
        .should('have.css', 'top', '58px')
        .should('have.css', 'left', '8px')
        .then(() => {
          placement.value = 'right';

          cy.dataCy('floating').should('have.css', 'top', '8px').should('have.css', 'left', '58px');
        });
    });
  });

  it('updates floating coords on middleware change', () => {
    const middleware = ref<Middleware[]>([]);
    const { UseFloating } = setup({ middleware });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating')
        .should('have.css', 'top', '58px')
        .should('have.css', 'left', '8px')
        .then(() => {
          middleware.value = [offset(10)];

          cy.dataCy('floating').should('have.css', 'top', '68px').should('have.css', 'left', '8px');
        });
    });
  });

  it('updates floating coords on reference size change when `autoUpdate` is provided', { retries: 5 }, () => {
    const { UseFloating, reference } = setup({ whileElementsMounted: autoUpdate });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating')
        .should('have.css', 'top', '58px')
        .should('have.css', 'left', '8px')
        .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
        .then(() => {
          reference.size *= 2;

          cy.dataCy('floating').should('have.css', 'top', '108px').should('have.css', 'left', '33px');
        });
    });
  });

  it('updates floating coords on floating size change when `autoUpdate` is provided', { retries: 5 }, () => {
    const { UseFloating, floating } = setup({ whileElementsMounted: autoUpdate });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating')
        .should('have.css', 'top', '58px')
        .should('have.css', 'left', '8px')
        .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
        .then(() => {
          floating.size /= 2;

          cy.dataCy('floating').should('have.css', 'top', '58px').should('have.css', 'left', '20.5px');
        });
    });
  });

  it('updates floating position on strategy change', () => {
    const strategy = ref<Strategy>('absolute');
    const { UseFloating } = setup({ strategy });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating')
        .should('have.css', 'position', 'absolute')
        .then(() => {
          strategy.value = 'fixed';

          cy.dataCy('floating').should('have.css', 'position', 'fixed');
        });
    });
  });

  it('fallbacks to default when placement becomes undefined', () => {
    const placement = ref<Placement | undefined>('right');
    const { UseFloating } = setup({ placement });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating')
        .should('have.css', 'top', '8px')
        .should('have.css', 'left', '58px')
        .then(() => {
          placement.value = undefined;

          cy.dataCy('floating').should('have.css', 'top', '58px').should('have.css', 'left', '8px');
        });
    });
  });

  it('fallbacks to default when strategy becomes undefined', () => {
    const strategy = ref<Strategy | undefined>('fixed');
    const { UseFloating } = setup({ strategy });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating')
        .should('have.css', 'position', 'fixed')
        .then(() => {
          strategy.value = undefined;

          cy.dataCy('floating').should('have.css', 'position', 'absolute');
        });
    });
  });

  it('calls `whileElementsMounted` callback when reference and floating are mounted', () => {
    const whileElementsMounted = cy.spy();
    const { UseFloating } = setup({ whileElementsMounted });

    cy.mount(UseFloating).then(() => {
      cy.wrap(whileElementsMounted).should('have.callCount', 1);
    });
  });

  it('does not call `whileElementsMounted` callback on reference change', () => {
    const whileElementsMounted = cy.spy();
    const { UseFloating, reference } = setup({ whileElementsMounted });

    cy.mount(UseFloating).then(() => {
      reference.size *= 2;

      cy.wrap(whileElementsMounted).should('have.callCount', 1);
    });
  });

  it('does not call `whileElementsMounted` callback on floating change', () => {
    const whileElementsMounted = cy.spy();
    const { UseFloating, floating } = setup({ whileElementsMounted });

    cy.mount(UseFloating).then(() => {
      floating.size /= 2;

      cy.wrap(whileElementsMounted).should('have.callCount', 1);
    });
  });

  it('does not call `whileElementsMounted` cleanup callback on reference change', () => {
    const cleanup = cy.spy();
    const { UseFloating, reference } = setup({ whileElementsMounted: () => cleanup });

    cy.mount(UseFloating).then(() => {
      reference.size *= 2;

      cy.wrap(cleanup).should('have.callCount', 0);
    });
  });

  it('does not call `whileElementsMounted` cleanup callback on floating change', () => {
    const cleanup = cy.spy();
    const { UseFloating, floating } = setup({ whileElementsMounted: () => cleanup });

    cy.mount(UseFloating).then(() => {
      floating.size /= 2;

      cy.wrap(cleanup).should('have.callCount', 0);
    });
  });

  it('calls `whileElementsMounted` cleanup callback on reference visibility change', () => {
    const cleanup = cy.spy();
    const { UseFloating, reference } = setup({ whileElementsMounted: () => cleanup });

    cy.mount(UseFloating).then(() => {
      reference.isVisible = false;

      cy.wrap(cleanup).should('have.callCount', 1);
    });
  });

  it('calls `whileElementsMounted` cleanup callback on floating visibility change', () => {
    const cleanup = cy.spy();
    const { UseFloating, floating } = setup({ whileElementsMounted: () => cleanup });

    cy.mount(UseFloating).then(() => {
      floating.isVisible = false;

      cy.wrap(cleanup).should('have.callCount', 1);
    });
  });

  it('calls `whileElementsMounted` cleanup callback on unmount', () => {
    const cleanup = cy.spy();
    const { UseFloating } = setup({ whileElementsMounted: () => cleanup });

    cy.mount(UseFloating).then(({ wrapper }) => {
      wrapper.unmount();

      cy.wrap(cleanup).should('have.callCount', 1);
    });
  });

  it('calls `whileElementsMounted` cleanup callback on scope dispose', () => {
    const cleanup = cy.spy();
    const { UseFloating } = setup({ whileElementsMounted: () => cleanup });

    cy.mount(UseFloating).then(({ wrapper }) => {
      wrapper.getCurrentComponent().scope.stop();

      cy.wrap(cleanup).should('have.callCount', 1);
    });
  });

  it('assigns `middlewareData` without infinite loop', () => {
    const { UseFloating } = setup({
      middleware: [
        {
          name: 'middlewareData',
          fn() {
            return { data: { content: 'Floating UI is awesome!' } };
          },
        },
      ],
    });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('middleware-data').should(
        'have.text',
        JSON.stringify({ middlewareData: { content: 'Floating UI is awesome!' } }),
      );
    });
  });

  it('updates floating when `update` function is called', () => {
    const { UseFloating } = setup();

    cy.mount(UseFloating).then(({ wrapper, component }) => {
      wrapper.element.setAttribute('style', 'margin-top: 50px');

      cy.dataCy('floating')
        .should('have.css', 'top', '58px')
        .should('have.css', 'left', '8px')
        .then(() => {
          component.update();

          cy.dataCy('floating').should('have.css', 'top', '100px').should('have.css', 'left', '8px');
        });
    });
  });

  it('allows to use with virtual reference', () => {
    const { UseFloating, reference } = setup();

    reference.isVisible = false;

    cy.mount(UseFloating).then(({ component }) => {
      component.reference = {
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
      };

      cy.dataCy('floating').should('have.css', 'top', '58px').should('have.css', 'left', '8px');
    });
  });

  it('allows to use with component type reference', () => {
    const { UseFloating, components } = setup();
    const UseFloatingReference: DefineComponent = defineComponent({
      name: 'UseFloatingReference',

      render() {
        return <div />;
      },
    });

    components.UseFloatingReference = UseFloatingReference;

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating').should('have.css', 'top', '58px').should('have.css', 'left', '8px');
    });
  });

  it('allows to use with component type floating', () => {
    const { UseFloating, components } = setup();
    const UseFloatingFloating: DefineComponent = defineComponent({
      name: 'UseFloatingFloating',

      render() {
        return <div />;
      },
    });

    components.UseFloatingFloating = UseFloatingFloating;

    cy.mount(UseFloating).then(() => {
      cy.dataCy('floating').should('have.css', 'top', '58px').should('have.css', 'left', '8px');
    });
  });
});
