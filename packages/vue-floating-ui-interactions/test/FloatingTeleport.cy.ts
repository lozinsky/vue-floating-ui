import { FloatingTeleport } from 'vue-floating-ui-interactions';
import { defineComponent } from 'vue-floating-ui-vue-demi';

describe('FloatingTeleport', () => {
  const FloatingSandbox = defineComponent({
    name: 'FloatingSandbox',
    components: { FloatingTeleport },
    props: ['id', 'root', 'disabled'],
    template: /* HTML */ `
      <FloatingTeleport v-bind="$props">
        <div data-cy-tooltip>Tooltip</div>
      </FloatingTeleport>
    `,
  });

  it('renders tooltip inside wrapper inside body when no props are provided', () => {
    cy.mount(FloatingSandbox)
      .getByDataCy('tooltip')
      .parent()
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('renders tooltip inside wrapper inside body when `id` prop is provided but element is not exist', () => {
    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getByDataCy('tooltip')
      .parent()
      .should('have.id', 'custom-id')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('renders tooltip inside wrapper when `id` prop is provided and element exists', () => {
    const wrapper = document.createElement('div');

    wrapper.id = 'custom-id';
    document.body.appendChild(wrapper);

    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getByDataCy('tooltip')
      .parent()
      .invoke('is', Cypress.$(wrapper))
      .should('be.true')
      .then(() => {
        wrapper.remove();
      });
  });

  it('renders tooltip inside root when `root` prop is provided', () => {
    cy.mount(FloatingSandbox, { root: document.body })
      .getByDataCy('tooltip')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('updates wrapper on `id` prop change', () => {
    cy.mount(FloatingSandbox)
      .getByDataCy('tooltip')
      .parent()
      .then((node) => {
        cy.setProps({ id: 'custom-id' }).getByDataCy('tooltip').parent().invoke('is', node).should('be.false');
      });
  });

  it('renders tooltip inside wrapper then inside root', () => {
    const wrapper = document.createElement('div');

    wrapper.id = 'custom-id';
    document.body.appendChild(wrapper);

    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getByDataCy('tooltip')
      .parent()
      .invoke('is', Cypress.$(wrapper))
      .should('be.true')
      .setProps({ root: document.body })
      .getByDataCy('tooltip')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true')
      .then(() => {
        wrapper.remove();
      });
  });

  it('removes wrapper on unmount when no props were provided', () => {
    cy.mount(FloatingSandbox)
      .getByDataCy('tooltip')
      .parent()
      .then((wrapper) => {
        cy.unmount().wrap(wrapper).should('not.exist');
      });
  });

  it('removes wrapper on unmount when `id` prop was provided but element did not exist', () => {
    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getByDataCy('tooltip')
      .parent()
      .then((wrapper) => {
        cy.unmount().wrap(wrapper).should('not.exist');
      });
  });

  it('does not remove wrapper on unmount when `id` prop was provided and element existed', () => {
    const wrapper = document.createElement('div');

    wrapper.id = 'custom-id';
    document.body.appendChild(wrapper);

    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getByDataCy('tooltip')
      .parent()
      .then((wrapper) => {
        cy.unmount().wrap(wrapper).should('exist');
      })
      .then(() => {
        wrapper.remove();
      });
  });
});
