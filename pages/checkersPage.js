const spaceLocator = (spaceNumber) => `img[name="${spaceNumber}"]`;
const restartLocator = '//a[normalize-space()="Restart..."]';

class CheckersPage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async navigate() {
    await this.page.goto(`${this.baseUrl}/game/checkers/`);
  }

  async isSiteUp() {
    const siteTitle = await this.page.title();
    return siteTitle.includes("Checkers");
  }

  async makeMove(move) {
    await this.page.click(spaceLocator(move.from));
    await this.page.click(spaceLocator(move.to));
  }

  async getMessage() {
    // Wait for the element to appear
    await this.page.waitForSelector("#message");
    // Get the text content of the element
    const messageText = await this.page.textContent("#message");
    console.log(messageText);
    return messageText;
  }

  async readyToMakeMove() {
    let attemptCount = 0;
    while (attemptCount < 5) {
      console.log("attemptCount++; ", attemptCount);

      // Get the text content of the element
      const messageText = await this.getMessage();
      // Check if the text matches "Make a move"
      console.log("messageText; ", messageText);
      if (messageText === "Make a move.") {
        return true;
      } else {
        // check again
        await this.page.waitForTimeout(2000);
        attemptCount++;
      }
    }
    return false; // Return false if "Make a move" message is not found after 5 attempts
  }

  async restartGame() {
    await this.page.click(restartLocator);
  }

  async wait(millsec) {
    await this.page.waitForTimeout(millsec);
  }
}

module.exports = CheckersPage;
