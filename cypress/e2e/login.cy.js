describe('Authentification with MFA', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('Should hide the connection input and show the MFA input after a success authentication', () => {
    cy.window().then(win => {
      win.authenticate('user1', 'pass1');
    });
    cy.get('[data-cy="loginForm"]').should('not.exist');
    cy.get('[data-cy="mfa-code"]').should('be.visible');
  });

  it('Should send the MFA after a successful authentication', () => {
    cy.intercept('POST', '/mfa/send-code', (req) => {
      req.reply({ statusCode: 200, body: { success: true } });
    }).as('sendCode');

    cy.window().then(win => {
      win.authenticate('user1', 'pass1');
    });

    cy.wait('@sendCode').then((interception) => {
      assert.isTrue(interception.response.body.success, 'Le processus d\'authentification a réussi');
      cy.wait(1000);
      cy.task('getEmails').then((emails) => {
        console.log("emails:", emails);
        cy.wrap(emails).should('have.length.at.least', 1);
        const mfaEmail = emails.find(email => email.includes("Votre code MFA"));
        cy.wrap(mfaEmail).should('exist');
      });
    });
  });

  it('Should send the MFA after a successful authentication', () => {
    cy.intercept('POST', '/mfa/send-code', (req) => {
      req.reply({ statusCode: 200, body: { success: true } });
    }).as('sendCode');

    cy.window().then(win => {
      win.authenticate('user1', 'pass1');
    });

    cy.wait('@sendCode').then((interception) => {
      assert.isTrue(interception.response.body.success, 'Le processus d\'authentification a réussi');
      cy.mailosaurGetMessages(Cypress.env('MAILOSAUR_SERVER_ID')).then((messages) => {
        const mfaCode = messages[0].text.body.match(/Code MFA: (\d+)/)[1];
        cy.wrap(mfaCode).should('exist');
      });
    });
  });

  it('Have to simulate MFA answer', () => {
    cy.get('[data-cy="username"]').type("user1");
    cy.get('[data-cy="password"]').type("pass1");


    cy.intercept('POST', '/mfa/send-code', (req) => {
      if (!req.body || !req.body.email) {
        req.reply({ statusCode: 400, body: { error: 'Email requis' } });
      } else {
        const code = '123456';
        console.log(`Code MFA envoyé à ${req.body.email}: ${code}`);
        req.reply({ statusCode: 200, body: { success: true } });
      }
    }).as('sendCode');
    cy.get('[data-cy="signInButton"]').click();

    cy.wait('@sendCode').then(() => {
      cy.get('[data-cy="mfa-code"]').type('123456');
      cy.get('[data-cy="mfaButton"]').click();

      cy.url().should('include', '/index.html');
    });
  });

  it('Should authentificate', () => {
    cy.get('[data-cy="username"]').type('user1');
    cy.get('[data-cy="password"]').type('pass1');
    cy.get('[data-cy="signInButton"]').click();

    cy.get('[data-cy="mfa-code"]').type('123456');
    cy.get('[data-cy="mfaButton"]').click();

    cy.url().should('include', '/index.html');
  });

  it('Should print an error if the MFA is incorrect', () => {
    cy.get('[data-cy="username"]').type('user1');
    cy.get('[data-cy="password"]').type('pass1');
    cy.get('[data-cy="signInButton"]').click();

    cy.get('[data-cy="mfa-code"]').type('000000');
    cy.get('[data-cy="mfaButton"]').click();

    cy.contains('The mfa is not correct... Try again').should('be.visible');
  });
});

describe('Authenticated Session Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.getCookie('_csrf').then((cookie) => {
      const csrfToken = cookie && cookie.value; 

      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/login',
        body: {
          username: 'user1',
          password: 'pass1'
        },
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        failOnStatusCode: false 
      });

      cy.session('userSession', () => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/login',
          body: {
            username: 'user1',
            password: 'pass1'
          },
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
          failOnStatusCode: false
        }).then((resp) => {
          
        });
      });
    });
  });

  it('allows posting a comment with an authenticated session', () => {
    cy.visit('http://localhost:3000/frontend/src/articles/article1.html');

    cy.get('[data-cy="user-comment"]').type('New test comment');
    cy.get('[data-cy="post-comment-button"]').click();

    cy.get('[data-cy="snack-bar"]').should('contain', 'Your comment has been posted');
  });
  it('prevents posting a comment after logout', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.visit('http://localhost:3000/frontend/src/articles/article1.html '); 
    cy.get('[data-cy="user-comment"]').should('not.exist'); 
  });
});
