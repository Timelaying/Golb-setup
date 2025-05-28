describe("🔐 Auth API", () => {
    const baseUrl = "http://localhost:3000/api"; // adjust if needed
  
    it("✅ returns success for correct login", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        body: {
          username: "testuser",
          password: "password123"
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("accessToken");
        expect(res.body).to.have.property("refreshToken");
        expect(res.body.message).to.eq("Login successful!");
      });
    });
  
    it("❌ rejects wrong password", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        body: {
          username: "testuser",
          password: "wrongpass"
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq("Invalid credentials.");
      });
    });
  
    it("❌ rejects unknown user", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/login`,
        body: {
          username: "ghost",
          password: "password123"
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.code).to.eq("USER_NOT_FOUND");
      });
    });
  
    it("✅ /api/test route works", () => {
      cy.request(`${baseUrl}/test`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.eq("✅ Auth route working");
      });
    });
  });
  