import { test, expect } from '@playwright/test';

test('ST-05: Sort Product ราคาน้อยไปมากต้องเรียงถูกต้อง', async ({ page }) => {

  // Login
  await page.goto('/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);

  // Sort Product ราคาจากน้อยไปมาก
  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption('lohi');

  // ตรวจสอบว่าราคาสินค้าถูกเรียงจากน้อยไปมาก
  const priceTexts = await page.locator('.inventory_item_price').allTextContents();

  const prices = priceTexts.map((text) => parseFloat(text.replace('$', '')));

  const sortedPrices = [...prices].sort((a, b) => a - b);

  expect(prices).toEqual(sortedPrices);
});
