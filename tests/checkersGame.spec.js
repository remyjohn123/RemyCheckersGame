const { test, expect, beforeAll, it } = require("@playwright/test");
const config = require("../config");
const CheckersPage = require("../pages/checkersPage");
const testData = require("../test-data.json");
const { Verify } = require("crypto");

let checkersPage;
beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  checkersPage = new CheckersPage(page, config.baseUrl);
  await checkersPage.navigate();
});

//changing the config to run sequentially
test.describe.configure({ mode: "serial" });

test.describe("Checkers Game", () => {
  test("Site is up", async () => {
    const isUp = await checkersPage.isSiteUp();
    expect(isUp).toBeTruthy();
  });

  test("Make five legal moves as orange", async () => {
    for (let move of testData.moves) {
      console.log("Move  ");
      console.log(move);
      await checkersPage.makeMove(move);
      await checkersPage.wait(3000);
      // Check if readyToMakeMove is false
      expect(await checkersPage.readyToMakeMove()).toBe(true);
    }
  });

  test("Restart the game", async () => {
    await checkersPage.restartGame();
    
    //Confirm game is restarted by checking the massage changes to 'Select an orange piece to move.'
    await checkersPage.wait(3000);
    const messageText = await checkersPage.getMessage();
    console.log(" messageText2  ", messageText);
    expect(messageText).toEqual("Select an orange piece to move.");
  });
});
