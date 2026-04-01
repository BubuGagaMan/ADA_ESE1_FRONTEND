describe("User Profile and Metrics", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/refresh-token", { statusCode: 401 }).as(
      "silentBoot",
    );
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

    cy.visit("/login");
    cy.get('input[placeholder="Username"]').type("fitness_guru");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait(["@loginRequest", "@getUser", "@getMetrics"]);
  });

  it("updates physical metrics successfully", () => {
    cy.intercept("PUT", "**/user-metrics", {
      statusCode: 200,
      fixture: "updated-metrics.json",
    }).as("updateMetricsRequest");

    cy.contains("Profile").click();

    cy.get('input[name="height"]').should("have.value", "175");
    cy.get('input[name="weight"]').should("have.value", "75");

    cy.get('input[name="height"]').clear().type("180");
    cy.get('input[name="weight"]').clear().type("80");

    cy.get('select[name="activityLevel"]').select("1.725");

    cy.get("button")
      .contains(/Save|Update/i)
      .click();

    cy.wait("@updateMetricsRequest");

    cy.contains(/successfully|updated/i).should("be.visible");
  });

  it("triggers a username change request and shows the confirmation step", () => {
    cy.intercept("POST", "**/confirmation-code-request", {
      statusCode: 200,
      body: { message: "Confirmation code sent to your email" },
    }).as("codeRequest");

    cy.contains("Profile").click();

    cy.get("button").contains("Change Username").click();

    cy.get('input[placeholder="New Username"]').type("new_guru_name");

    cy.get("button").contains("Request Code").click();

    cy.wait("@codeRequest");

    cy.contains("Confirm Change").should("be.visible");
    cy.get('input[placeholder="CODE"]').should("be.visible");
  });
});
