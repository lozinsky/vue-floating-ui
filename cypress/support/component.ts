import { mount } from 'cypress/vue';
import { isVue2 } from 'vue-floating-ui-vue-demi';

class Context {
  private isConsoleWarnAllowed?: boolean;
  private isConsoleErrorAllowed?: boolean;

  public beforeEach() {
    this.isConsoleWarnAllowed = false;
    this.isConsoleErrorAllowed = false;

    cy.stub(console, 'warn').as('consoleWarn');
    cy.stub(console, 'error').as('consoleError');
  }

  public afterEach() {
    if (!this.isConsoleWarnAllowed) {
      cy.getConsoleWarn().should('not.be.called');
    }

    if (!this.isConsoleErrorAllowed) {
      cy.getConsoleError().should('not.be.called');
    }
  }

  public getConsoleWarn() {
    return cy.get<sinon.SinonStub>('@consoleWarn');
  }

  public getConsoleError() {
    return cy.get<sinon.SinonStub>('@consoleError');
  }

  public allowConsoleWarn() {
    return cy.then(() => void (this.isConsoleWarnAllowed = true)) as Cypress.Chainable<void>;
  }

  public allowConsoleError() {
    return cy.then(() => void (this.isConsoleErrorAllowed = true)) as Cypress.Chainable<void>;
  }
}

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
      getConsoleWarn: () => Chainable<sinon.SinonStub>;
      getConsoleError: () => Chainable<sinon.SinonStub>;
      allowConsoleWarn: () => Chainable<void>;
      allowConsoleError: () => Chainable<void>;
    }
  }
}

const context = new Context();
const wrapper: Wrapper = isVue2
  ? new Vue2Wrapper(() => ({ mount, wrapper: Cypress.vueWrapper }))
  : new Vue3Wrapper(() => ({ mount, wrapper: Cypress.vueWrapper }));

Cypress.Commands.add('mount', (component, props, slots) => wrapper.mount(component, props, slots));
Cypress.Commands.add('unmount', () => wrapper.unmount());
Cypress.Commands.add('setProps', (props) => wrapper.setProps(props));
Cypress.Commands.add('getElement', () => wrapper.getElement());
Cypress.Commands.add('getComponent', () => wrapper.getComponent());
Cypress.Commands.add('getByDataCy', (value) => cy.get(`[data-cy-${value}]`));
Cypress.Commands.add('getConsoleWarn', () => context.getConsoleWarn());
Cypress.Commands.add('getConsoleError', () => context.getConsoleError());
Cypress.Commands.add('allowConsoleWarn', () => context.allowConsoleWarn());
Cypress.Commands.add('allowConsoleError', () => context.allowConsoleError());

beforeEach(() => {
  context.beforeEach();
});

afterEach(() => {
  context.afterEach();
});
