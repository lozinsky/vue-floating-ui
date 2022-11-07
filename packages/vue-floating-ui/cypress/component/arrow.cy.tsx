import { type DefineComponent, defineComponent, reactive, ref } from 'vue';
import {
  type ArrowOptions,
  type Placement,
  type Side,
  type UseFloatingOptions,
  arrow,
  autoUpdate,
  useFloating,
} from 'vue-floating-ui';

describe('arrow', () => {
  type Components = {
    UseFloatingArrow: string | DefineComponent;
  };

  function setup(options?: Omit<ArrowOptions, 'element'> & Pick<UseFloatingOptions, 'whileElementsMounted'>) {
    const reference = reactive({ size: 50 });
    const floating = reactive({ size: 50 });
    const placement = ref<Placement>('bottom');
    const components: Components = { UseFloatingArrow: 'div' };
    const UseFloating = defineComponent({
      name: 'UseFloating',

      setup() {
        const element = ref<HTMLElement | null>(null);
        const position = useFloating({
          placement,
          whileElementsMounted: options?.whileElementsMounted,
          middleware: [arrow({ element, padding: options?.padding })],
        });

        return { ...position, element };
      },

      render() {
        const { UseFloatingArrow } = components;
        const side = this.placement.split('-')[0] as Side;
        const oppositeSideByCurrentSide: Record<Side, Side> = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        };

        return (
          <>
            <div
              ref='reference'
              style={{
                aspectRatio: '1',
                backgroundColor: 'brown',
                width: `${reference.size}px`,
              }}
            />
            <div
              ref='floating'
              style={{
                aspectRatio: '1',
                backgroundColor: 'dimgrey',
                width: `${floating.size}px`,
                position: this.strategy,
                top: `${this.y ?? 0}px`,
                left: `${this.x ?? 0}px`,
              }}
            >
              <UseFloatingArrow
                data-cy-arrow
                ref='element'
                style={{
                  position: 'absolute',
                  backgroundColor: 'darkslateblue',
                  width: '8px',
                  height: '8px',
                  transform: 'rotate(45deg)',
                  top: `${this.middlewareData.arrow?.y ?? 0}px`,
                  left: `${this.middlewareData.arrow?.x ?? 0}px`,
                  [oppositeSideByCurrentSide[side]]: '-4px',
                }}
              />
            </div>
          </>
        );
      },
    });

    return { UseFloating, reference, floating, placement, components };
  }

  it('updates arrow coords on placement change', () => {
    const { UseFloating, placement } = setup();

    cy.mount(UseFloating).then(() => {
      cy.dataCy('arrow')
        .should('have.css', 'top', '-4px')
        .should('have.css', 'left', '21px')
        .then(() => {
          placement.value = 'right';

          cy.dataCy('arrow').should('have.css', 'top', '21px').should('have.css', 'left', '-4px');
        });
    });
  });

  it('does not update arrow coords on reference size change when `autoUpdate` is provided', { retries: 5 }, () => {
    const { UseFloating, reference } = setup({ whileElementsMounted: autoUpdate });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('arrow')
        .should('have.css', 'top', '-4px')
        .should('have.css', 'left', '21px')
        .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
        .then(() => {
          reference.size *= 2;

          cy.dataCy('arrow').should('have.css', 'top', '-4px').should('have.css', 'left', '21px');
        });
    });
  });

  it('updates arrow coords on floating size change when `autoUpdate` is provided', { retries: 5 }, () => {
    const { UseFloating, floating } = setup({ whileElementsMounted: autoUpdate });

    cy.mount(UseFloating).then(() => {
      cy.dataCy('arrow')
        .should('have.css', 'top', '-4px')
        .should('have.css', 'left', '21px')
        .then(() => Cypress.Promise.delay(100)) // we need to wait a little while for the `ResizeObserver` to be ready
        .then(() => {
          floating.size /= 2;

          cy.dataCy('arrow').should('have.css', 'top', '-4px').should('have.css', 'left', '8.5px');
        });
    });
  });

  it('works with alignment placement', () => {
    const { UseFloating, placement, floating } = setup();

    placement.value = 'right-end';
    floating.size /= 2;

    cy.mount(UseFloating).then(() => {
      cy.dataCy('arrow').should('have.css', 'top', '0px').should('have.css', 'left', '-4px');
    });
  });

  it('works with alignment placement and with padding', () => {
    const { UseFloating, placement, floating } = setup({ padding: 4 });

    placement.value = 'right-end';
    floating.size /= 2;

    cy.mount(UseFloating).then(() => {
      cy.dataCy('arrow').should('have.css', 'top', '4px').should('have.css', 'left', '-4px');
    });
  });

  it('allows to use with component type arrow', () => {
    const { UseFloating, components } = setup();
    const UseFloatingArrow: DefineComponent = defineComponent({
      name: 'UseFloatingArrow',

      render() {
        return <div />;
      },
    });

    components.UseFloatingArrow = UseFloatingArrow;

    cy.mount(UseFloating).then(() => {
      cy.dataCy('arrow').should('have.css', 'top', '-4px').should('have.css', 'left', '21px');
    });
  });
});
