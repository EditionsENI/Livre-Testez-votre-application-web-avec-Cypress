describe('Security Tests', () => {
    it('Should fail without a valid CSRF token', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login',
            body: {
                username: 'user1',
                password: 'pass1'
            },
            failOnStatusCode: false,
            headers: {
                'CSRF-Token': 'invalid-or-missing-token'
            }
        }).then((response) => {
            expect(response.status).to.eq(403);
        });
    });
    it('Should verify the cookies have the attributs HttpOnly, Secure et SameSite', () => {
        cy.visit('http://localhost:3000/login');

        cy.getCookies().then(cookies => {
            cookies.forEach(cookie => {
                expect(cookie).to.have.property('httpOnly', true);
                expect(cookie).to.have.property('secure', true);
                expect(cookie).to.have.property('sameSite', 'strict');
            });
        });
    });
    it('Should verify the cookies has an expiration date', () => {
        cy.visit('http://localhost:3000/login');

        cy.getCookies().then(cookies => {
            cookies.forEach(cookie => {
                expect(cookie).to.have.property('expiry').and.not.be.null;
            });
        });
    });
});
describe('Scan ZAP', () => {
    it('Start scan, execute tests and get the report ZAP', () => {
      const targetUrl = 'http://localhost:3000';
  
      cy.startZapScan(targetUrl);

      cy.startZapScan();
    });
  });
  