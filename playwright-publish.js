const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://175.178.189.234:3000';
const ADMIN_USER = 'admin';
const ADMIN_PASS = '123456';

(async () => {
  const article = JSON.parse(fs.readFileSync(path.join(__dirname, 'article-nano-banano.json'), 'utf8'));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // Step 1: Login via API and get token
    console.log('=== Step 1: Login ===');
    const loginRes = await page.request.post(`${BASE_URL}/api/auth/login`, {
      data: { username: ADMIN_USER, password: ADMIN_PASS },
    });
    const loginData = await loginRes.json();
    console.log('Login response:', loginData);

    // Extract token from Set-Cookie header
    const setCookie = loginRes.headers()['set-cookie'] || '';
    const tokenMatch = setCookie.match(/admin_token=([^;]+)/);
    if (!tokenMatch) {
      throw new Error('Failed to get auth token. Headers: ' + JSON.stringify(loginRes.headers()));
    }
    const token = tokenMatch[1];
    console.log('Got token:', token.substring(0, 20) + '...');

    // Set cookie in browser context (bypass Secure flag issue with HTTP)
    await context.addCookies([{
      name: 'admin_token',
      value: token,
      domain: '175.178.189.234',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    }]);
    console.log('Cookie set in browser');

    // Step 2: Navigate to new article page
    console.log('\n=== Step 2: Create new article ===');
    await page.goto(`${BASE_URL}/admin/articles/new`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('New article page loaded:', page.url());
    await page.screenshot({ path: 'playwright-01-new-article.png' });

    // Step 3: Fill form
    console.log('Filling form fields...');

    // Title
    const titleInput = page.locator('input[placeholder="输入文章标题"]');
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await titleInput.fill(article.title);
    console.log('  Title:', article.title.substring(0, 30) + '...');

    // Slug - clear auto-generated and fill our own
    const slugInput = page.locator('input[placeholder="url-friendly-slug"]');
    await slugInput.clear();
    await slugInput.fill(article.slug);
    console.log('  Slug:', article.slug);

    // Content - find the textarea in the MdEditor
    const contentTextarea = page.locator('textarea[placeholder*="Markdown"]');
    await contentTextarea.waitFor({ state: 'visible', timeout: 5000 });
    // Use evaluate to set value directly (avoid fill timeout on large content)
    await contentTextarea.evaluate((el, val) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeInputValueSetter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, article.content);
    console.log('  Content:', article.content.length + ' chars');

    // Excerpt
    await page.fill('textarea[placeholder*="摘要"]', article.excerpt);
    console.log('  Excerpt filled');

    // SEO Title
    await page.fill('input[placeholder*="SEO标题"]', article.seoTitle);
    console.log('  SEO Title filled');

    // SEO Description
    await page.fill('textarea[placeholder*="搜索引擎"]', article.seoDescription);
    console.log('  SEO Description filled');

    // SEO Keywords
    await page.fill('input[placeholder*="关键词"]', article.seoKeywords);
    console.log('  SEO Keywords filled');

    await page.screenshot({ path: 'playwright-02-form-filled.png', fullPage: true });
    console.log('Form screenshot saved');

    // Step 4: Publish
    console.log('\n=== Step 3: Publish article ===');
    const publishBtn = page.locator('button', { hasText: '发布文章' });
    await publishBtn.click();
    console.log('Clicked publish button');

    // Wait for redirect to articles list
    await page.waitForURL('**/admin/articles', { timeout: 15000 });
    console.log('Published! Redirected to:', page.url());

    // Verify article in admin list
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'playwright-03-admin-list.png', fullPage: true });

    const articleInList = await page.locator(`text="${article.title}"`).first().isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Article visible in admin list:', articleInList);

    // Step 5: Visit published article page
    console.log('\n=== Step 4: Verify published article page ===');
    await page.goto(`${BASE_URL}/blog/${article.slug}`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Article page loaded:', await page.title());
    await page.screenshot({ path: 'playwright-04-article-top.png' });

    // Check title
    const titleVisible = await page.locator('h1').first().isVisible({ timeout: 5000 }).catch(() => false);
    const titleText = await page.locator('h1').first().textContent().catch(() => '');
    console.log('Title visible:', titleVisible, '|', titleText?.substring(0, 40));

    // Check images
    const imgCount = await page.locator('img[src*="unsplash"]').count();
    console.log('Unsplash images found:', imgCount);

    // Check content sections
    const hasContent = await page.locator('text="提示词工程"').first().isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Content section "提示词工程" visible:', hasContent);

    const hasConclusion = await page.locator('text="结语"').first().isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Conclusion section visible:', hasConclusion);

    // Scroll to bottom and screenshot
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'playwright-05-article-bottom.png' });

    // Step 6: Check blog listing page
    console.log('\n=== Step 5: Verify blog listing page ===');
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: 'playwright-06-blog-listing.png', fullPage: true });

    const blogListing = await page.locator(`text="${article.title}"`).first().isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Article visible in blog listing:', blogListing);

    // Final summary
    console.log('\n========================================');
    console.log('PUBLISH & VERIFY COMPLETE');
    console.log('Article: ' + article.title);
    console.log('URL: ' + BASE_URL + '/blog/' + article.slug);
    console.log('Admin list:', articleInList ? 'OK' : 'MISSING');
    console.log('Article page title:', titleVisible ? 'OK' : 'MISSING');
    console.log('Images:', imgCount > 0 ? imgCount + ' found' : 'NONE');
    console.log('Content:', hasContent ? 'OK' : 'MISSING');
    console.log('Blog listing:', blogListing ? 'OK' : 'MISSING');
    console.log('========================================');

    if (!articleInList || !titleVisible || imgCount === 0 || !hasContent) {
      console.log('\n⚠ Some checks failed. Review screenshots for details.');
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: 'playwright-error.png', fullPage: true });
    console.error('Error screenshot saved: playwright-error.png');
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
