// @ts-check
const { test, expect } = require("@playwright/test");
const { swagLabCredential } = require("./utils/credential");

test("login with standard user", async ({ page }) => {
    await page.goto(swagLabCredential.url);
    await expect(page).toHaveTitle(/swag labs/i);

    await page
        .getByPlaceholder(/username/i)
        .fill(swagLabCredential.standardUserName);
    await page
        .locator('input[placeholder="Password"]')
        .fill(swagLabCredential.password);
    await page.locator("input#login-button").click();
    await expect(page).toHaveURL(/.*\/inventory\.html/);
});

test("login with locked out user", async ({ page }) => {
    await page.goto(swagLabCredential.url);
    await expect(page).toHaveTitle(/swag labs/i);

    await page
        .getByPlaceholder(/username/i)
        .fill(swagLabCredential.lockedOutUserName);
    await page
        .locator('input[placeholder="Password"]')
        .fill(swagLabCredential.password);
    await page.locator("input#login-button").click();
    await expect(page.locator('h3[data-test="error"]')).toHaveText(
        /this user has been locked out/
    );
});
