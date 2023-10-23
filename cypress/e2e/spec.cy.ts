/// <reference types="cypress" />
import userConfig from "../../app/userConfig";

describe('Homepage page test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('displays social network list', () => {
    cy.get('.avatar').should('be.visible');
    cy.get('h1').contains(userConfig.fullName);
    cy.get('.alias').contains(userConfig.alias);
    cy.get('.network').should('have.length', userConfig.socialNetworks.length);
    cy.get('footer').should('be.visible');
  });
});
