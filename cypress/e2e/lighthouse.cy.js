describe('Audit de performance avec Lighthouse', () => {
    it('devrait passer un audit Lighthouse', () => {
        cy.visit('http://localhost:3000/');
        cy.lighthouse();
    });
});
