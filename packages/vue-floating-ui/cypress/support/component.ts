import { mount } from 'cypress/vue';
import type { EffectScope } from 'vue';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      dataCy: (value: string) => Chainable<JQuery<HTMLElement>>;
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    scope: EffectScope;
  }
}

Cypress.Commands.add('mount', mount);
Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy-${value}]`));

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
