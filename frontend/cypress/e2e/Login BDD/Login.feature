Feature: Login functionality

  Scenario: User logs in with valid credentials
    Given I visit the login page
    When I enter a valid email and password
    And I click the login button
    Then I should see home page

  Scenario: User logs in with invalid credentials
    Given I visit the login page
    When I enter an invalid email and password
    And I click the login button
    Then I should see the error message
