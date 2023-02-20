const { test, expect } = require("@playwright/test");
const { swagLabCredential } = require("./utils/credential");
const { login } = require("./utils/helper");

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

test("buy a product from store", async ({ page }) => {
    await login(
        page,
        expect,
        swagLabCredential.standardUserName,
        swagLabCredential.password
    );

    await page
        .getByText(/add to cart/i)
        .nth(0)
        .click();
    await expect(
        page.locator('button[name="remove-sauce-labs-backpack"]')
    ).toBeVisible();
    expect(page.locator("span.shopping_cart_badge").isVisible).toBeTruthy();

    await page.locator("a.shopping_cart_link").click();
    await expect(page).toHaveURL(/.*\/cart\.html/);

    await page.locator('button[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*\/checkout-step-one\.html/);

    await page.locator('input[data-test="firstName"]').fill("abc");
    await page.locator('input[data-test="lastName"]').fill("123");
    await page.locator('input[data-test="postalCode"]').fill("560066");
    await page.locator('input[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*\/checkout-step-two\.html/);

    await page.locator('button[data-test="finish"]').click();
    await expect(page).toHaveURL(/.*\/checkout-complete\.html/);
    await expect(page.locator("h2.complete-header")).toHaveText(
        /thank you for your order/i
    );
});

test("goto about page", async ({ page }) => {
    await login(
        page,
        expect,
        swagLabCredential.standardUserName,
        swagLabCredential.password
    );

    await page.locator("button#react-burger-menu-btn").click();
    await expect(page.locator("nav.bm-item-list")).toBeVisible();

    await page.locator("a#about_sidebar_link").click();
    await expect(page).toHaveURL(/.*\/saucelabs\.com/);
});

test("change product sorting order", async ({ page }) => {
    await login(
        page,
        expect,
        swagLabCredential.standardUserName,
        swagLabCredential.password
    );
});
