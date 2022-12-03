import { useFloatingTeleportNode } from 'vue-floating-ui-interactions';
import { defineComponent, effectScope, toRef } from 'vue-floating-ui-vue-demi';

describe('useFloatingTeleportNode', () => {
  type FloatingSandboxProps = {
    id?: string;
  };

  const FloatingSandbox = defineComponent({
    name: 'FloatingSandbox',
    props: ['id'],
    setup(props: FloatingSandboxProps) {
      return { node: useFloatingTeleportNode({ id: toRef(props, 'id') }) };
    },
    template: /* HTML */ `<div />`,
  });

  it('returns node inside body when `id` prop is not provided', () => {
    cy.mount(FloatingSandbox)
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true');
  });

  it('returns node inside body when `id` prop is provided but element is not exist', () => {
    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .parent()
      .invoke('is', Cypress.$('body'))
      .should('be.true')
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .should('have.id', 'custom-id');
  });

  it('returns node when `id` prop is provided and element exists', () => {
    const node = document.createElement('div');

    node.id = 'custom-id';
    document.body.appendChild(node);

    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .invoke('is', Cypress.$(node))
      .should('be.true')
      .then(() => {
        node.remove();
      });
  });

  it('returns new node on `id` prop change', () => {
    cy.mount(FloatingSandbox)
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .then((node) => {
        cy.setProps({ id: 'custom-id' })
          .getComponent<InstanceType<typeof FloatingSandbox>>()
          .its('node')
          .invoke('is', node)
          .should('be.false');
      });
  });

  it('removes node on unmount when `id` prop was not provided', () => {
    cy.mount(FloatingSandbox)
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .then((node) => {
        cy.unmount().wrap(node).should('not.exist');
      });
  });

  it('removes node on unmount when `id` prop was provided but element did not exist', () => {
    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .then((node) => {
        cy.unmount().wrap(node).should('not.exist');
      });
  });

  it('removes old node on `id` prop change', () => {
    cy.mount(FloatingSandbox)
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .then((node) => {
        cy.setProps({ id: 'custom-id' }).wrap(node).should('not.exist');
      });
  });

  it('removes node on scope dispose', () => {
    const FloatingSandbox = defineComponent({
      name: 'FloatingSandbox',
      props: ['id'],
      setup(props: FloatingSandboxProps) {
        const scope = effectScope();

        function dispose() {
          scope.stop();
        }

        return { node: scope.run(() => useFloatingTeleportNode({ id: toRef(props, 'id') })), dispose };
      },
      template: /* HTML */ `<div />`,
    });

    cy.mount(FloatingSandbox)
      .getComponent<InstanceType<typeof FloatingSandbox>>()
      .its('node')
      .then((node) => {
        cy.getComponent<InstanceType<typeof FloatingSandbox>>().invoke('dispose').wrap(node).should('not.exist');
      });
  });

  it('does not remove node on unmount when `id` prop was provided and element existed', () => {
    const node = document.createElement('div');

    node.id = 'custom-id';
    document.body.appendChild(node);

    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .unmount()
      .wrap(node)
      .should('exist')
      .then(() => {
        node.remove();
      });
  });

  it('does not remove old node on `id` prop change when element existed', () => {
    const node = document.createElement('div');

    node.id = 'custom-id';
    document.body.appendChild(node);

    cy.mount(FloatingSandbox, { id: 'custom-id' })
      .setProps({})
      .wrap(node)
      .should('exist')
      .then(() => {
        node.remove();
      });
  });
});
