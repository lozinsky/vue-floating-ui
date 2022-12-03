import { mount } from 'cypress/vue';
import { isVue2 } from 'vue-floating-ui-vue-demi';

interface Wrapper {
  mount: (
    component: unknown,
    props?: Record<string, unknown>,
    slots?: Record<string, unknown>,
  ) => Cypress.Chainable<void>;
  unmount: () => Cypress.Chainable<void>;
  setProps: (props: Record<string, unknown>) => Cypress.Chainable<void>;
  getElement: () => Cypress.Chainable<JQuery<Element>>;
  getComponent: <T>() => Cypress.Chainable<T>;
}

class Vue2Wrapper implements Wrapper {
  private readonly getDependencies;

  public constructor(getDependencies: () => unknown) {
    this.getDependencies = getDependencies as () => {
      mount: (component: unknown, options?: Record<string, unknown>) => Cypress.Chainable<void>;
      wrapper: {
        element: Element;
        vm: unknown;
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

  getElement() {
    return cy.wrap(this.getDependencies().wrapper.element);
  }

  getComponent<T>() {
    return cy.then(() => this.getDependencies().wrapper.vm) as Cypress.Chainable<T>;
  }
}

class Vue3Wrapper implements Wrapper {
  private readonly getDependencies;

  public constructor(getDependencies: () => unknown) {
    this.getDependencies = getDependencies as () => {
      mount: (component: unknown, options?: Record<string, unknown>) => Cypress.Chainable<void>;
      wrapper: {
        element: Element;
        vm: unknown;
        unmount: () => void;
        setProps: (props: Record<string, unknown>) => Promise<void>;
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

  getElement() {
    return cy.wrap(this.getDependencies().wrapper.element);
  }

  getComponent<T>() {
    return cy.then(() => this.getDependencies().wrapper.vm) as Cypress.Chainable<T>;
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      mount: (component: unknown, props?: Record<string, unknown>, slots?: Record<string, unknown>) => Chainable<void>;
      unmount: () => Chainable<void>;
      setProps: (props: Record<string, unknown>) => Chainable<void>;
      getElement: () => Chainable<JQuery<Element>>;
      getComponent: <T>() => Chainable<T>;
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
