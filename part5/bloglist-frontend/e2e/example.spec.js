import { expect, test } from '@playwright/test';
import axios from 'axios';

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');

    await axios.post('http://localhost:3001/api/reset');
    await axios.post('http://localhost:3001/api/users', {
      username: 'username1',
      name: 'realname1',
      password: 'password1',
    });
    await axios.post('http://localhost:3001/api/users', {
      username: 'username2',
      name: 'realname2',
      password: 'password2',
    });
    let token = await axios
      .post('http://localhost:3001/api/login', {
        username: 'username1',
        password: 'password1',
      })
      .then((res) => res.data.token);
    await axios.post(
      'http://localhost:3001/api/blogs',
      {
        title: 'initial blog title',
        author: 'initial blog author',
        url: 'initial blog url',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });

  test('Login form is shown', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'log in to application' })
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('username1');
      await page.getByRole('textbox', { name: 'password' }).fill('password1');
      await page.getByRole('button', { name: 'login' }).click();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('test');
      await page.getByRole('textbox', { name: 'password' }).fill('test');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(page.getByText('Wrong credentials')).toBeVisible();
    });
  });

  test.describe('Blog', () => {
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('username1');
      await page.getByRole('textbox', { name: 'password' }).fill('password1');
      await page.getByRole('button', { name: 'login' }).click();

      await page.getByRole('button', { name: 'create new blog' }).click();
      await page.getByRole('textbox', { name: 'title' }).fill('new blog title');
      await page
        .getByRole('textbox', { name: 'author' })
        .fill('new blog author');
      await page.getByRole('textbox', { name: 'url' }).fill('new blog url');
      await page.getByRole('button', { name: 'create' }).click();

      await expect(
        page.getByText('new blog title', { exact: true })
      ).toBeVisible();
    });

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('username1');
      await page.getByRole('textbox', { name: 'password' }).fill('password1');
      await page.getByRole('button', { name: 'login' }).click();

      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByText('1', { exact: true })).toBeVisible();
    });

    test('a blog can be deleted', async ({ page }) => {
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      await page.getByRole('textbox', { name: 'username' }).fill('username1');
      await page.getByRole('textbox', { name: 'password' }).fill('password1');
      await page.getByRole('button', { name: 'login' }).click();

      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'delete' }).click();

      await expect(page.getByText('blog deleted')).toBeVisible();
      await expect(page.getByText('Error deleting blog')).not.toBeVisible();
      await expect(page.getByText('initial blog title')).not.toBeVisible();
    });

    test('other user cannot delete blog', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('username2');
      await page.getByRole('textbox', { name: 'password' }).fill('password2');
      await page.getByRole('button', { name: 'login' }).click();

      await page.getByRole('button', { name: 'view' }).click();
      await expect(
        page.getByRole('button', { name: 'delete' })
      ).not.toBeVisible();
    });

    test('blog post are sorted correctly', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('username1');
      await page.getByRole('textbox', { name: 'password' }).fill('password1');
      await page.getByRole('button', { name: 'login' }).click();

      await page.getByRole('button', { name: 'create new blog' }).click();
      await page.getByRole('textbox', { name: 'title' }).fill('title1');
      await page.getByRole('textbox', { name: 'author' }).fill('author1');
      await page.getByRole('textbox', { name: 'url' }).fill('url1');
      await page.getByRole('button', { name: 'create' }).click();
      await expect(page.getByText('title1', { exact: true })).toBeVisible();

      await page.getByRole('button', { name: 'create new blog' }).click();
      await page.getByRole('textbox', { name: 'title' }).fill('title2');
      await page.getByRole('textbox', { name: 'author' }).fill('author2');
      await page.getByRole('textbox', { name: 'url' }).fill('url2');
      await page.getByRole('button', { name: 'create' }).click();
      await expect(page.getByText('title2', { exact: true })).toBeVisible();

      // Open all blog details
      await page.getByRole('button', { name: 'view' }).nth(2).click();
      await page.getByRole('button', { name: 'view' }).nth(1).click();
      await page.getByRole('button', { name: 'view' }).nth(0).click();

      // Like the second blog 1 times
      const blog2 = page
        .getByText('title1', { exact: true })
        .locator('xpath=../..');
      await blog2.getByRole('button', { name: 'like' }).click();

      // Like the third blog 2 times
      const blog3 = page
        .getByText('title2', { exact: true })
        .locator('xpath=../..');
      await blog3.getByRole('button', { name: 'like' }).click();
      await blog3.getByRole('button', { name: 'like' }).click();

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check the order of the blogs
      const blogElements = await page.getByTestId('blog-item').all();
      const likes = await Promise.all(
        blogElements.map(
          async (element) => await element.getAttribute('data-likes')
        )
      );
      const titles = await Promise.all(
        blogElements.map(
          async (element) => await element.getAttribute('data-title')
        )
      );
      expect(likes).toEqual(['2', '1', '0']);
      expect(titles).toEqual(['title2', 'title1', 'initial blog title']);
    });
  });
});
