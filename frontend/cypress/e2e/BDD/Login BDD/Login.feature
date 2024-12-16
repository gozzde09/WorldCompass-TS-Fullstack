Feature: Login functionality
  As a user,
  I want to log in to the application with valid credentials
  So that I can access the application

  Scenario: Successful login with valid credentials
    Given I visit the login page
    When I enter valid email and password
    And I click the login button
    Then I should see a success message
    And I should be redirected to the home page

  Scenario: Login gives error with invalid credentials
    Given I visit the login page
    When I enter an invalid email and password
    And I click the login button
    Then I should see an error message
