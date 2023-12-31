describe('Event Detail Tests', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3000/event/ticketmaster/G5v0Z9Yc3BZyy');
    });
  
    it('should display the correct event name', () => {
      cy.get('.event-name').should('have.text', 'Phoenix Suns vs. Memphis Grizzlies');
    });
  
    it('should display the correct time zone', () => {
      cy.get('.event-time-location').should('contain.text', 'America/Phoenix');
    });
  
    it('should display a day of the week in the event date', () => {
      cy.get('.event-time-location').invoke('text').should('match', /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/);
    });
  
    it('should allow a user to add a post', () => {
      cy.get('input[type="text"]').type('Test Post Title'); 
      cy.get('textarea').type('This is the content for the test post.'); 
      cy.get('button').contains('Add').click();
    }); 
  
    it('should display the date and time with correct format', () => {
      cy.get('.event-time-location').invoke('text').should('match', /(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4} · \d{1,2}:\d{2} [APM]{2} [A-Za-z\/]+.*$/);
    });

});