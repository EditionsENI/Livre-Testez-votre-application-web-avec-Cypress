describe('API Tests', () => {
    it('Should post a comment successfully', () => {
        cy.request('POST', 'http://localhost:3000/post-comment', {
            comment: 'This is a comment!'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('insertId');
        });
    });
    it('Should not send an empty comment', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/post-comment',
            body: { comment: '' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });
    it('Should fetch comments', () => {
        cy.request('GET', 'http://localhost:3000/get-comments').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.be.greaterThan(0);
        });
    });
    it('Should fetch users', () => {
        cy.request('GET', 'http://localhost:3000/get-users').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.eq(3);
            expect(response.body).to.deep.include({ id: 1, username: 'testuser', email: 'testuser@testvulnerabilities.fr', password: 'testpassword', role: 'ADMIN' });
            expect(response.body).to.deep.include({ id: 2, username: 'user1', email: 'user1@testvulnerabilities.fr', password: 'pass1', role: 'USER' });
            expect(response.body).to.deep.include({ id: 3, username: 'user2', email: 'user2@testvulnerabilities.fr', password: 'pass2', role: 'USER' });
        });
    });
    it('successfully stubs the post-comment response', () => {
        cy.visit('http://localhost:3000/frontend/src/articles/article1.html');
        cy.intercept('POST', '/post-comment', {
            statusCode: 200,
            body: { insertId: 1 }
        }).as('postComment');

        cy.get('[data-cy="user-comment"]').type('Test comment');
        cy.get('[data-cy="post-comment-button"]').click();

        cy.wait('@postComment').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);

        });
    });
    it('spies on get-comments call', () => {
        cy.intercept('GET', '/get-comments').as('getComments');
        cy.visit('http://localhost:3000/frontend/src/articles/article1.html')

        cy.wait('@getComments', { timeout: 10000 }).then((interception) => {
            expect(interception.request.method).to.eq('GET');
        });
    });

});
describe('Temporary Message Display', () => {
    it('uses clock to test temporary message visibility', () => {
        cy.visit('http://localhost:3000/frontend/src/articles/article1.html');
        cy.clock();
        cy.get('[data-cy="post-comment-button"]').click();
        cy.tick(5000);
        cy.get('[data-cy="snack-bar"]').should('not.be.visible');
    });
});
