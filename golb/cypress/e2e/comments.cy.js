describe('💬 Comment API Tests', () => {
    const baseUrl = 'http://localhost:5000/api'; // Adjust port if different
    let userId = 1;
    let postId = 1;
    let commentId;
  
    it('✅ Should add a comment', () => {
      cy.request('POST', `${baseUrl}/comment`, {
        userId,
        postId,
        content: 'Cypress test comment'
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('id');
        commentId = res.body.id;
      });
    });
  
    it('✅ Should edit the comment', () => {
      cy.request('PUT', `${baseUrl}/comment/${commentId}`, {
        userId,
        content: 'Updated comment content'
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.comment.content).to.eq('Updated comment content');
      });
    });
  
    it('✅ Should fetch nested comments', () => {
      cy.request(`${baseUrl}/comments/${postId}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    });
  
    it('✅ Should delete the comment', () => {
      cy.request('DELETE', `${baseUrl}/comment/${commentId}`, {
        userId
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
  });
  