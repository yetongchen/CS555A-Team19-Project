describe('User Profile', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="text"]').type('test@example.com');
    cy.get('input[type="password"]').type('Password@123');
    cy.get('form').submit();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('.welcome').click().then(() => {
      cy.url().should('eq', 'http://localhost:3000/profile');
    });
  });



  it('logs in and navigates to the user profile page', () => {
    cy.get('.user-profile').should('contain', 'testuser');
  });




  // it('allows the user to change their profile picture and username', () => {
  //   //cy.url().should('eq', 'http://localhost:3000/profile');

  //   cy.contains('Edit Profile').click();

  //   cy.get('.ant-modal').should('be.visible');

  //   cy.get('input[name="imageURL"]').should('exist').attachFile('profileImgTest.jpg');

  //   cy.get('input[placeholder="Name"]').clear().type('newusername');

  //   cy.contains('button', 'OK').click();

  //   cy.wait(1000); 

  //   cy.get('.user-profile').should('contain', 'newusername');
  // });




  // it('navigates through paginated events', () => {
  //   cy.contains('Events').click();
  
  //   cy.get('.ant-pagination').should('exist');
  
  //   cy.get('.ant-pagination').find('li').contains('2').click();
  
  //   cy.get('.event-card').should('have.length', 10);
  // });




  // it('navigates through paginated comments', () => {
  //   cy.contains('Comments').click();
  
  //   cy.get('.ant-pagination').should('exist');
  
  //   cy.get('.ant-pagination').find('li').contains('2').click();
  
  //   cy.get('.comment-card').should('have.length', 10);
  // });
});
