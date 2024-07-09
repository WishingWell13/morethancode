const puppeteer = require("puppeteer");

describe("Testing for basic features of the Theme Toggle", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/index.html");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should have a theme toggle button", async () => {
    await page.waitForSelector("theme-toggle");

    const themeToggle = await page.$("theme-toggle");
    expect(themeToggle).not.toBeNull();
  });

  it("should change the theme when the toggle button is clicked", async () => {
    await page.waitForSelector("theme-toggle");

    const themeToggle = await page.$("theme-toggle");

    const initialTheme = await page.evaluate((toggle) => {
      return document.querySelector("html").getAttribute("data-theme");
    }, themeToggle);

    const otherTheme = initialTheme === "light" ? "dark" : "light";

    const oneClick = await page.evaluate((toggle) => {
      let toggleButton = toggle.shadowRoot.querySelector("button");
      toggleButton.click();
      return document.querySelector("html").getAttribute("data-theme");
    }, themeToggle);

    expect(oneClick).toBe(otherTheme);

    const afterTheme = await page.evaluate((toggle) => {
      return document.querySelector("html").getAttribute("data-theme");
    }, themeToggle);

    const twoClick = await page.evaluate((toggle) => {
      let toggleButton = toggle.shadowRoot.querySelector("button");
      toggleButton.click();
      return document.querySelector("html").getAttribute("data-theme");
    }, themeToggle);

    expect(twoClick).toBe(initialTheme);
  });

  // data-theme!

  it("should reveal localStorage value", async () => {
    await page.waitForSelector("theme-toggle");
    const themeToggle = await page.$("theme-toggle");

    // await themeToggle.click();

    const moduleName = await page.evaluate((myItem) => {
      return myItem.getAttribute("data-theme");
    }, themeToggle);

    let currentTheme = await page.evaluate(() => {
      return localStorage.getItem("theme");
    });
    console.log("Current Theme is: ", currentTheme);
  });
});
