describe('Event Detail Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/events/79728781933');
  });

  it('should display the correct event name', () => {
    cy.get('.event-name').should('have.text', 'Horology 101 to 103, Melbourne, Australia');
  });

  it('should display the correct time zone', () => {
    cy.get('.event-time-location').should('contain.text', 'Australia/Melbourne');
  });

  it('should display a day of the week in the event date', () => {
    cy.get('.event-time-location').invoke('text').should('match', /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/);
  });

});
