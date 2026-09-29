import { test, expect } from '@playwright/test';

test('ST-07: Checkout ต้องตรวจสอบ Postal Code ที่จำเป็น', async ({ page }) => {
  // Login
  await page.goto('/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);

  // เพิ่มสินค้า 1 ชิ้น (Backpack)
  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // เปิด Cart
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);

  // Checkout
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);


  // กรอก First Name + Last Name แต่ไม่กรอก Postal Code
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');

  await page.locator('[data-test="continue"]').click();


  // ตรวจสอบว่ามีข้อความแจ้งเตือน Postal Code is required
  await expect(page.locator('[data-test="error"]'))
    .toContainText('Postal Code is required');

  // ต้องยังอยู่หน้า Checkout Step One
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});
