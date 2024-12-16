Feature: Register functionality
  As a user,
  I want to register with valid details
  So that I can access the application

  Scenario: Successful registration
    Given I visit the registration page
    When I fill out the form with valid details
    And I click the register button
    Then I should see a success message
    And I should be redirected to the home page

  Scenario: Registration gives error with missing details
    Given I visit the registration page
    When I submit the form with missing required fields
    Then I should see validation error messages

  Scenario: Registration gives validation error with invalid email
    Given I visit the registration page
    When I submit the form with an invalid email
    Then I should see a validation error for the email field
