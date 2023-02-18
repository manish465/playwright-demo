import { swagLabCredential } from "./credential";

export const login = async (page, expect, username, password) => {
    await page.goto(swagLabCredential.url);
    await expect(page).toHaveTitle(/swag labs/i);

    await page.getByPlaceholder(/username/i).fill(username);
    await page.locator('input[placeholder="Password"]').fill(password);
    await page.locator("input#login-button").click();
    await expect(page).toHaveURL(/.*\/inventory\.html/);
};
