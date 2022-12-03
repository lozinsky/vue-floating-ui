import { type Component, type TeleportProps, defineComponent, Teleport } from 'vue-floating-ui-vue-demi';

describe('Teleport', () => {
  const FloatingSandbox = defineComponent({
    name: 'FloatingSandbox',
    components: { Teleport: Teleport as unknown as Component<TeleportProps> },
    props: ['to', 'disabled'],
    template: /* HTML */ `
      <Teleport v-bind="$props">
        <slot />
      </Teleport>
    `,
  });

  it('renders content via selector target', () => {
    cy.mount(FloatingSandbox, { to: 'body' }, { default: /* HTML */ `<div data-cy-content>Content</div>` })
      .getByDataCy('content')
      .should('have.text', 'Content')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('renders content via element target', () => {
    cy.mount(FloatingSandbox, { to: document.body }, { default: /* HTML */ `<div data-cy-content>Content</div>` })
      .getByDataCy('content')
      .should('have.text', 'Content')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('renders multiple teleports with the same target', () => {
    const FloatingSandbox = defineComponent({
      name: 'FloatingSandbox',
      components: { Teleport: Teleport as unknown as Component<TeleportProps> },
      props: ['to'],
      template: /* HTML */ `
        <div>
          <Teleport v-bind="$props">
            <div data-cy-a>A</div>
          </Teleport>
          <Teleport v-bind="$props">
            <div data-cy-b>B</div>
          </Teleport>
        </div>
      `,
    });

    cy.mount(FloatingSandbox, { to: document.body })
      .getByDataCy('a')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true')
      .getByDataCy('b')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('renders content in the place when disabled', () => {
    cy.mount(FloatingSandbox, { disabled: true }, { default: /* HTML */ `<div data-cy-content>Content</div>` })
      .getByDataCy('root')
      .within(() => {
        cy.getByDataCy('content').should('exist');
      });
  });

  it('updates target on `to` prop change', () => {
    const target = document.createElement('div');

    document.body.appendChild(target);

    cy.mount(FloatingSandbox, { to: document.body }, { default: /* HTML */ `<div data-cy-content>Content</div>` })
      .getByDataCy('content')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true')
      .setProps({ to: target })
      .getByDataCy('content')
      .parent()
      .invoke('is', Cypress.$(target))
      .should('be.true');
  });

  it('updates location on `disabled` prop change', () => {
    cy.mount(FloatingSandbox, { to: document.body }, { default: /* HTML */ `<div data-cy-content>Content</div>` })
      .getByDataCy('content')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true')
      .setProps({ disabled: true })
      .getByDataCy('root')
      .within(() => {
        cy.getByDataCy('content').should('exist');
      })
      .setProps({ disabled: false })
      .getByDataCy('content')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('updates content on slot change', () => {
    const FloatingSandbox = defineComponent({
      name: 'FloatingSandbox',
      components: { Teleport: Teleport as unknown as Component<TeleportProps> },
      props: ['to'],
      data() {
        return { content: 'A' };
      },
      template: /* HTML */ `
        <Teleport v-bind="$props">
          <div data-cy-content>{{ content }}</div>
        </Teleport>
      `,
    });

    cy.mount(FloatingSandbox, { to: document.body })
      .getByDataCy('content')
      .should('have.text', 'A')
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .then((component) => void (component.content = 'B'))
      .getByDataCy('content')
      .should('have.text', 'B');
  });

  it('removes content on unmount', () => {
    cy.mount(FloatingSandbox, { to: document.body }, { default: /* HTML */ `<div data-cy-content>Content</div>` })
      .getByDataCy('content')
      .should('exist')
      .unmount()
      .getByDataCy('content')
      .should('not.exist');
  });
});
