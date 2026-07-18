import { test, expect } from '@playwright/test';

test('has title and interactive elements', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/NexCart/);

  // Check if main navigation exists
  await expect(page.getByRole('navigation')).toBeVisible();

  // Check if cart button is present
  const cartBtn = page.getByRole('button', { name: /cart/i });
  await expect(cartBtn).toBeVisible();
});

test('navigation to products page works', async ({ page }) => {
  await page.goto('/');
  
  // Click on products link
  await page.getByRole('link', { name: /shop|products/i }).first().click();
  
  // Expect URL to have products
  await expect(page).toHaveURL(/.*products/);
});
