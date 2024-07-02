describe("Testing for basic features of the Progress Toggle", () => {
  let page;

  // First, sync the website
  beforeAll(async () => {
    page = await browser.newPage();

    page.on("console", async (msg) => {
      const msgArgs = msg.args();
      for (let i = 0; i < msgArgs.length; ++i) {
        console.log(await msgArgs[i].jsonValue());
      }
    });

    await page.goto("http://localhost:3000/index.html");
  });

  afterAll(async () => {
    await page.close();
  });

  it("should have a progress toggle", async () => {
    await page.waitForSelector("progress-toggle");

    const progressToggle = await page.$("progress-toggle");
    expect(progressToggle).not.toBeNull();
  });

  it("should update the status when a toggle is clicked", async () => {
    await page.waitForSelector("progress-toggle");

    const progressToggle = await page.$("progress-toggle");

    const moduleName = await page.evaluate((myItem) => {
      return myItem.getAttribute("data-module");
    }, progressToggle);

    let toggleStatus = await page.evaluate(
      (myItem, moduleName) => {
        const todoRadioButton =
          myItem.shadowRoot.querySelector('[value="todo"]');

        console.log("My todo toggle: ", JSON.stringify(todoRadioButton));

        todoRadioButton.click();

        return localStorage.getItem(`${moduleName}-status`);
      },
      progressToggle,
      moduleName
    );

    expect(toggleStatus).toBe("todo");

    toggleStatus = await page.evaluate(
      (myItem, moduleName) => {
        const inProgressRadioButton = myItem.shadowRoot.querySelector(
          'input:where([type="radio"][role="toggle"][value="inprogress"])'
        );

        inProgressRadioButton.click();

        return localStorage.getItem(`${moduleName}-status`);
      },
      progressToggle,
      moduleName
    );

    expect(toggleStatus).toBe("inprogress");

    toggleStatus = await page.evaluate(
      (myItem, moduleName) => {
        const doneRadioButton = myItem.shadowRoot.querySelector(
          'input:where([type="radio"][role="toggle"][value="done"])'
        );

        doneRadioButton.click();
        return localStorage.getItem(`${moduleName}-status`);
      },
      progressToggle,
      moduleName
    );

    expect(toggleStatus).toBe("done");
  });
});
