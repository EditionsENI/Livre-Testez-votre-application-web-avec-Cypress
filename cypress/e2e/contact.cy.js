
import { faker } from '@faker-js/faker';

describe('Contact Form Tests', () => {

  beforeEach(() => {
    cy.visit('/frontend/src/contact.html');
  });

  it('checks for form elements', () => {
    cy.get('[data-cy="contact-name"]').should('exist');
    cy.get('[data-cy="contact-email"]').should('exist');
    cy.get('[data-cy="contact-message"]').should('exist');
    cy.get('[data-cy="contact-submit-button"]').should('exist');
  });

  it('submits the form with valid data', () => {
    cy.get('[data-cy="contact-name"]').type('John Doe');
    cy.get('[data-cy="contact-email"]').type('john.doe@example.com');
    cy.get('[data-cy="contact-message"]').type('Hello, this is a test message.');
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-snackbar-ok"]')
      .should('be.visible')
      .should('contain', 'Thanks for your message !')
  });

  it('displays error messages for empty fields', () => {
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-name-error"]')
      .should('be.visible')
      .should('have.text', 'Please enter your name');
    cy.get('[data-cy="contact-email-error"]')
      .should('be.visible')
      .should('have.text', 'Please enter a valid email');
    cy.get('[data-cy="contact-message-error"]')
      .should('be.visible')
      .should('have.text', 'Please enter your message');
    cy.get('[data-cy="contact-snackbar-ok"]')
      .should('not.be.visible')
  });


  it('displays error message for a missing name', () => {
    cy.get('[data-cy="contact-email"]').type('john.doe@example.com');
    cy.get('[data-cy="contact-message"]').type('this is my message');
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-name-error"]')
      .should('be.visible')
      .should('contain', 'Please enter your name');
    cy.get('[data-cy="contact-snackbar-ok"]')
      .should('not.be.visible');
  });

  it('displays error message for a missing email', () => {
    cy.get('[data-cy="contact-name"]').type('john.doe');
    cy.get('[data-cy="contact-message"]').type('this is my message');
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-email-error"]')
      .should('be.visible')
      .should('contain', 'Please enter a valid email');
    cy.get('[data-cy="contact-snackbar-ok"]')
      .should('not.be.visible');
  });

  it('displays error message for a missing message', () => {
    cy.get('[data-cy="contact-name"]').type('john.doe');
    cy.get('[data-cy="contact-email"]').type('john.doe@example.com');
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-message-error"]')
      .should('be.visible')
      .should('contain', 'Please enter your message');
      cy.get('[data-cy="contact-snackbar-ok"]')
      .should('not.be.visible');
  });
  
  it('should accept and display Lorem Ipsum text correctly with a very long message', () => {
    const paragraph = faker.lorem.paragraphs(10);
    const name = faker.person.fullName();
    const email = faker.internet.email();

    console.log("paragraph: " + paragraph)
    console.log("name: " + name)
    console.log("email: " + email)

    cy.get('[data-cy="contact-name"]').type(name);
    cy.get('[data-cy="contact-email"]').type(email);
    cy.get('[data-cy="contact-message"]').type(paragraph);
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-snackbar-ok"]')
      .should('be.visible')
      .should('contain', 'Thanks for your message !')
  });

  it('Is RGPD consent is respected', () => {
    cy.get('[data-cy="consent"]').should('exist');
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-consent-error"]')
      .should('be.visible')
      .should('contain', 'Please read and accept our data processing conditions');
    cy.get('[data-cy="contact-snackbar-ok"]')
      .should('not.be.visible')
  });

  it('Is private policy is respected', () => {
    cy.get('[data-cy="footer-privacy-policy"]')
    .should('exist')
    .click();
    cy.get('[data-cy="privacy-policy-title"]')
    .should('exist')
    .should('have.text', 'Privacy Policy');
  });

  it('display error if XSS faille', () => {
    cy.get('[data-cy="contact-name"]').type('John Doe');
    cy.get('[data-cy="contact-email"]').type('john.doe@example.com');
    cy.get('[data-cy="contact-message"]').type("<script>alert('XSS');</script>");
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-message-error"]')
      .should('be.visible')
      .should('contain', 'Your message is not valid');
  });

  it('display error if SQL injection', () => {
    cy.get('[data-cy="contact-name"]').type('John Doe');
    cy.get('[data-cy="contact-email"]').type('john.doe@example.com');
    cy.get('[data-cy="contact-message"]').type('DROP TABLE users;');
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-message-error"]')
      .should('be.visible')
      .should('contain', 'Your message is not valid');
  });

  it('Is form contain SQL injection', () => {
    cy.get('[data-cy="contact-name"]').type('John Doe');
    cy.get('[data-cy="contact-email"]').type('john.doe@example.com');
    cy.get('[data-cy="contact-message"]').type('DROP TABLE users;');
    cy.get('[data-cy="contact-submit-button"]').click();
    cy.get('[data-cy="contact-snackbar-ok"]')
      .should('be.visible')
      .should('contain', 'Thanks for your message !')
    cy.visit('http://localhost:3000/frontend/src/admin.html')
    cy.get('#usersTable').find('tr').should('not.have.length', 0);
  });

});