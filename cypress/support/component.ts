import { mount } from 'cypress/vue';
import { type ComponentPublicInstance, type EffectScope, isVue2 } from 'vue-floating-ui-vue-demi';

interface Wrapper {
  mount: (
    component: unknown,
    props?: Record<string, unknown>,
    slots?: Record<string, unknown>,
  ) => Cypress.Chainable<void>;
  unmount: () => Cypress.Chainable<void>;
  setProps: (props: Record<string, unknown>) => Cypress.Chainable<void>;
  getScope: () => Cypress.Chainable<EffectScope>;
  getElement: () => Cypress.Chainable<JQuery<Element>>;
  getComponent: () => Cypress.Chainable<ComponentPublicInstance>;
}

class Vue2Wrapper implements Wrapper {
  private readonly getDependencies;

  public constructor(getDependencies: () => unknown) {
    this.getDependencies = getDependencies as () => {
      mount: (component: unknown, options?: Record<string, unknown>) => Cypress.Chainable<void>;
      wrapper: {
        element: Element;
        vm: ComponentPublicInstance & { _scope: EffectScope };
        destroy: () => void;
        setProps: (props: Record<string, unknown>) => Promise<void>;
      };
    };
  }

  mount(component: unknown, props?: Record<string, unknown>, slots?: Record<string, unknown>) {
    return this.getDependencies().mount(component, { propsData: props, slots });
  }

  unmount() {
    return cy.wrap(this.getDependencies().wrapper.destroy());
  }

  setProps(props: Record<string, unknown>) {
    return cy.then(() => this.getDependencies().wrapper.setProps(props));
  }

  getScope() {
    return cy.then(() => this.getDependencies().wrapper.vm._scope);
  }

  getElement() {
    return cy.wrap(this.getDependencies().wrapper.element);
  }

  getComponent() {
    return cy.then(() => this.getDependencies().wrapper.vm as ComponentPublicInstance);
  }
}

class Vue3Wrapper implements Wrapper {
  private readonly getDependencies;

  public constructor(getDependencies: () => unknown) {
    this.getDependencies = getDependencies as () => {
      mount: (component: unknown, options?: Record<string, unknown>) => Cypress.Chainable<void>;
      wrapper: {
        element: Element;
        vm: ComponentPublicInstance;
        unmount: () => void;
        setProps: (props: Record<string, unknown>) => Promise<void>;
        getCurrentComponent: () => { scope: EffectScope };
      };
    };
  }

  mount(component: unknown, props?: Record<string, unknown>, slots?: Record<string, unknown>) {
    return this.getDependencies().mount(component, { props, slots });
  }

  unmount() {
    return cy.wrap(this.getDependencies().wrapper.unmount());
  }

  setProps(props: Record<string, unknown>) {
    return cy.then(() => this.getDependencies().wrapper.setProps(props));
  }

  getScope() {
    return cy.wrap(this.getDependencies().wrapper.getCurrentComponent().scope);
  }

  getElement() {
    return cy.wrap(this.getDependencies().wrapper.element);
  }

  getComponent() {
    return cy.then(() => this.getDependencies().wrapper.vm);
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      mount: (component: unknown, props?: Record<string, unknown>, slots?: Record<string, unknown>) => Chainable<void>;
      unmount: () => Chainable<void>;
      setProps: (props: Record<string, unknown>) => Chainable<void>;
      getScope: () => Chainable<EffectScope>;
      getElement: () => Chainable<JQuery<Element>>;
      getComponent: <T extends ComponentPublicInstance>() => Chainable<T>;
      getByDataCy: (value: string) => Chainable<JQuery<HTMLElement>>;
    }
  }
}

const wrapper: Wrapper = isVue2
  ? new Vue2Wrapper(() => ({ mount, wrapper: Cypress.vueWrapper }))
  : new Vue3Wrapper(() => ({ mount, wrapper: Cypress.vueWrapper }));

Cypress.Commands.add('mount', (component, props, slots) => wrapper.mount(component, props, slots));
Cypress.Commands.add('unmount', () => wrapper.unmount());
Cypress.Commands.add('setProps', (props) => wrapper.setProps(props));
Cypress.Commands.add('getScope', () => wrapper.getScope());
Cypress.Commands.add('getElement', () => wrapper.getElement());
Cypress.Commands.add('getComponent', () => wrapper.getComponent());
Cypress.Commands.add('getByDataCy', (value) => cy.get(`[data-cy-${value}]`));

beforeEach(() => {
  cy.window().then((window) => {
    cy.spy(window.console, 'warn').as('console.warn');
    cy.spy(window.console, 'error').as('console.error');
  });
});

afterEach(() => {
  cy.get('@console.warn').should('not.be.called');
  cy.get('@console.error').should('not.be.called');
});
