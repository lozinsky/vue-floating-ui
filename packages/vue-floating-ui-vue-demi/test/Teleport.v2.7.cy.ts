import { defineComponent, Teleport } from 'vue-floating-ui-vue-demi';

describe('Teleport', () => {
  const FloatingSandbox = defineComponent({
    name: 'FloatingSandbox',
    components: { Teleport } as unknown as undefined,
    props: ['to', 'disabled'],
    template: /* HTML */ `
      <Teleport v-bind="$props">
        <slot />
      </Teleport>
    `,
  });

  it('renders first root element when multiple template root elements are provided', () => {
    cy.allowConsoleWarn()
      .mount(
        FloatingSandbox,
        { to: 'body' },
        {
          default: /* HTML */ `
            <div data-cy-a>A</div>
            <div data-cy-b>B</div>
          `,
        },
      )
      .getByDataCy('a')
      .should('exist')
      .getByDataCy('b')
      .should('not.exist');
  });

  it('warns when multiple template root elements are provided', () => {
    cy.allowConsoleWarn()
      .mount(
        FloatingSandbox,
        { to: 'body' },
        {
          default: /* HTML */ `
            <div data-cy-a>A</div>
            <div data-cy-b>B</div>
          `,
        },
      )
      .getConsoleWarn()
      .and('be.calledWithMatch', 'Multiple template root elements is not supported');
  });
});
