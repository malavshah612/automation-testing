describe("Wordpress profile page tests", () => {
  it("redirect to wordpress profile page", () => {
    cy.visit("https://wordpress.com/");
    cy.get(".x-nav-list--right").first().contains("Log In").click();
    cy.get("#usernameOrEmail")
      .should("be.visible")
      .type("malav.shah612@gmail.com");
    cy.get(".login__form-action button").should("not.be.disabled").click();
    cy.get("#password").should("be.visible").type("Qwerty@1234");
  });

  it("Tests for the profile and profile-links section with API checks", () => {
    cy.get(".login__form-action button")
      .should("not.be.disabled")
      .contains("Log In")
      .click();
    cy.intercept("GET", "**/settings?http_envelope=1").as("settings");
    cy.intercept("GET", "**/profile-links?http_envelope=1").as("profile-links");
    cy.intercept("POST", "**/new?http_envelope=1").as("add-url");
    cy.intercept("POST", "**/delete?http_envelope=1").as("delete-links");
    cy.get(".customer-home__heading h1").contains("My Home");
    cy.get(".masterbar__item-me").click({ force: true });
    cy.url().should("contains", "/me");
    cy.get(".edit-gravatar__label-container")
      .should("be.visible")
      .contains("Click to change photo");
    cy.wait("@settings").then((xhr) => {
      // Test for profile section
      if (
        xhr.response.statusCode === 200 &&
        xhr.response.body.body.first_name === ""
      ) {
        cy.get("#first_name").should("be.empty");
      } else {
        cy.get("#first_name").should(
          "have.value",
          xhr.response.body.body.first_name
        );
      }
      if (
        xhr.response.statusCode === 200 &&
        xhr.response.body.body.last_name === ""
      ) {
        cy.get("#last_name").should("be.empty");
      } else {
        cy.get("#last_name").should(
          "have.value",
          xhr.response.body.body.last_name
        );
      }
      if (
        xhr.response.statusCode === 200 &&
        xhr.response.body.body.display_name === ""
      ) {
        cy.get("#display_name").should("be.empty");
      } else {
        cy.get("#display_name").should(
          "have.value",
          xhr.response.body.body.display_name
        );
      }
      if (
        xhr.response.statusCode === 200 &&
        xhr.response.body.body.description === ""
      ) {
        cy.get("#description").should("be.empty");
      } else {
        cy.get("#description").should(
          "have.value",
          xhr.response.body.body.description
        );
      }

      // Test toggle switch for Gravatar profile
      if (
        xhr.response.statusCode === 200 &&
        xhr.response.body.body.gravatar_profile_hidden === true
      ) {
        cy.get("#inspector-toggle-control-0").should("be.checked");
      } else {
        cy.get("#inspector-toggle-control-0").should("not.be.checked");
      }
    });

    // Test for profile-link section
    cy.wait("@profile-links").then((xhr) => {
      console.log(xhr);
      if (
        xhr.response.statusCode === 200 &&
        xhr.response.body.body.profile_links.length === 0
      ) {
        cy.get(".profile-links__no-links").contains(
          "You have no sites in your profile links. You may add sites if you'd like."
        );
      } else {
        cy.get(".profile-link").should("be.visible");
      }
    });

    // Add URL in profile-links section
    cy.get(".section-header__actions .button").click();
    cy.get(".popover__menu > :nth-child(2)").click();
    cy.get(".profile > :nth-child(5)").should("be.visible");
    cy.get(".section-header__actions .button").should("be.disabled");
    cy.get(".profile-links-add-other__value").type("www.google.com");
    cy.get(".profile-links-add-other__title").type("Google");
    cy.get(".profile-links-add-other__add").click();
    cy.wait("@add-url").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      cy.get(".profile-links__list").should("be.visible");
    });

    // Delete URL in profile-links section
    cy.get(".profile-link > .button > .gridicon").click({ force: true });
    cy.wait("@delete-links").then((xhr) => {
      expect(xhr.response.body.code).to.eq(200);
    });
  });

  it("In profile page sidebar and profile sections should be visible", () => {
    cy.get(".sidebar__region").should("be.visible");
    cy.get(".profile__settings").should("be.visible");
    cy.get(".card").should("be.visible");
    cy.get(".section-header__actions .button").should("be.visible");
  });

  it("when Click on the help button popover should appear", () => {
    const banner = cy.get(".gdpr-banner");
    if (banner) {
      cy.get(".gdpr-banner__buttons .button").click();
    }
    cy.get(".inline-help .button .gridicon use").should("be.visible").click();
    cy.get(".popover__inner").should("be.visible");
    cy.get(".formatted-header__title").click();
  });
});
