describe("Diet, Meal, and Food Management", () => {
  beforeEach(() => {
    // 1. Core Auth Intercepts (REMOVED the toxic "**/api/**" catch-all!)
    cy.intercept("POST", "**/refresh-token", {
      statusCode: 401,
      body: { message: "No session" },
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

    // 2. Standard Login Sequence
    cy.visit("/login");
    cy.wait("@silentBoot");
    cy.get('input[placeholder="Username"]').type("fitness_guru");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.wait(["@loginRequest", "@getUser", "@getMetrics", "@getDiets"]);
  });

  it("views a pre-populated diet, expands meals, and searches for food", () => {
    cy.intercept("GET", "**/diet/99999999-9999-4999-a999-999999999999/meal", {
      statusCode: 200,
      fixture: "meals.json",
    }).as("getMeals");

    cy.intercept("GET", "**/meal/*/meal-food", {
      statusCode: 200,
      fixture: "meal-foods.json",
    }).as("getMealFoods");

    cy.intercept("GET", "**/food?*", {
      statusCode: 200,
      fixture: "foods-search.json",
    }).as("searchFoods");

    cy.contains("diet1").click();
    cy.wait("@getMeals");
    cy.contains("meal 1 diet 1").should("be.visible");

    cy.contains("Show Foods").click();
    cy.wait("@getMealFoods");
    cy.contains("Apple, with skin").should("be.visible");
    cy.contains("Greek Yogurt").should("be.visible");

    cy.contains("+ Add Food").click();
    cy.wait("@searchFoods");
    cy.contains("Almonds, raw").should("be.visible");
  });

  it("creates a new diet and successfully redirects to the dashboard", () => {
    cy.intercept("POST", "**/diet", {
      statusCode: 201,
      fixture: "new-diet.json",
    }).as("createDiet");

    cy.intercept("GET", "**/diet", {
      statusCode: 200,
      body: {
        data: [
          { id: "99999999-9999-4999-a999-999999999999", name: "diet1" },
          { id: "e5a5b7eb-e409-4348-ba82-3ca5df2493c6", name: "diet 2" },
        ],
      },
    }).as("getUpdatedDiets");

    // DO NOT use cy.visit('/create-diet') as it forces a hard reload!
    // Instead, click the button/link on your dashboard that navigates there.
    // Adjust the text below to match your actual dashboard button:
    cy.contains("+ Create Another Diet").click();

    cy.get('input[placeholder="e.g., Summer Cut, Bulking Phase"]').type(
      "diet 2",
    );
    cy.get("select").select("1");
    cy.get('button[type="submit"]').click();

    cy.wait("@createDiet");
    cy.wait("@getUpdatedDiets");

    cy.url().should("include", "/dashboard");
    cy.contains("diet 2").should("be.visible");
  });

  it("creates a new meal inside an existing diet", () => {
    const targetDietId = "99999999-9999-4999-a999-999999999999";

    // A complete mock object so your formatMacro function doesn't return NaN!
    const newMealMock = {
      id: "new-meal-123",
      name: "Post-Workout Snack",
      calories: 0,
      proteins: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      glycemic_load: 0,
    };

    // 1. Intercept the initial load of the diet's meals
    cy.intercept("GET", `**/diet/${targetDietId}/meal`, {
      statusCode: 200,
      fixture: "meals.json",
    }).as("getInitialMeals");

    // 2. Intercept the POST request.
    // I broadened the URL to "**/meal" just in case your API routes to /meal instead of /diet/:id/meal
    cy.intercept("POST", "**/meal*", {
      statusCode: 201,
      body: {
        message: "Meal created",
        data: newMealMock,
      },
    }).as("createMeal");

    // 3. Intercept the RE-FETCH of the meals after creation
    cy.intercept("GET", `**/diet/${targetDietId}/meal`, {
      statusCode: 200,
      body: {
        data: [
          {
            id: "11111111-2222-3333-4444-555555555555",
            name: "meal 1 diet 1",
            calories: 14622,
            carbohydrates: 680,
            proteins: 677,
            fats: 1017,
            glycemic_load: 323, // From your original fixture
          },
          newMealMock, // Our newly created meal with 0s
        ],
      },
    }).as("getUpdatedMeals");

    // 4. Navigate to the specific diet
    cy.contains("diet1").click();

    // 5. Click the Create Meal button
    cy.contains("+ Create Another Meal").click();

    // 6. Fill out the create meal form
    // (If your input placeholder is different, update the string below!)
    cy.get('input[type="text"]').type("Post-Workout Snack");
    cy.get('button[type="submit"]').click();

    // 7. Wait for the POST and the subsequent GET
    cy.wait("@createMeal");
    cy.wait("@getUpdatedMeals");

    // 8. Verify the new meal rendered correctly (and isn't showing NaN!)
    cy.contains("Post-Workout Snack").should("be.visible");
    cy.contains("Calories: 0").should("be.visible");
  });
});
