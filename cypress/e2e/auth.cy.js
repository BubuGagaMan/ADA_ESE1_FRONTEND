describe("Frontend Isolated Login & Data Load", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/refresh-token", {
      statusCode: 401,
      body: { message: "No active session" },
    }).as("silentBoot");

    cy.intercept("POST", "**/login", {
      statusCode: 200,
      fixture: "login.json",
    }).as("loginRequest");

    cy.intercept("GET", "**/user", {
      statusCode: 200,
      fixture: "user.json",
    }).as("getUser");

    cy.intercept("GET", "**/user-metrics", {
      statusCode: 200,
      fixture: "user-metrics.json",
    }).as("getMetrics");

    cy.intercept("GET", "**/diet", {
      statusCode: 200,
      fixture: "diets.json",
    }).as("getDiets");
  });

  it("logs in successfully and loads the dashboard without a backend", () => {
    cy.visit("/login");

    cy.wait("@silentBoot");

    cy.get('input[placeholder="Username"]').type("fitness_guru");
    // request is intercepted and mocked so inputs don't matter
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.wait("@getUser");

    cy.url().should("include", "/dashboard");

    cy.wait("@getMetrics");
    cy.wait("@getDiets");

    cy.contains("diet1").should("be.visible");
  });
});
