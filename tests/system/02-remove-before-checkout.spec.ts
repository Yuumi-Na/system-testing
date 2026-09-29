import { test, expect } from '@playwright/test';

test('ST-06: Remove Product ก่อน Checkout ต้องเหลือสินค้าถูกต้องใน Overview', async ({ page }) => {
  // Login
  await page.goto('/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);

  // Add สินค้า 2 ชิ้น (Backpack + Bike Light)
  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  await page
    .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
    .click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // เปิด Cart
  await page.locator('.shopping_cart_link').click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(2);

  // Remove Bike Light ก่อน Checkout
  await page
    .locator('[data-test="remove-sauce-labs-bike-light"]')
    .click();

  await expect(page.locator('.cart_item')).toHaveCount(1);

  // Checkout
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);

  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  await page.locator('#postal-code').fill('50000');

  await page.locator('[data-test="continue"]').click();

  // Verify Overview เหลือเพียง 1 Product
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(1);

  await expect(page.locator('.inventory_item_name'))
    .toHaveText('Sauce Labs Backpack');

  await expect(page.getByText('Sauce Labs Bike Light', { exact: true }))
    .toHaveCount(0);
});
