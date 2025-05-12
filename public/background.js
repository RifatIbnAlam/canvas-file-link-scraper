const CANVAS_SITE = "https://usu.instructure.com/courses";
const LINKS = "LINKS";
const GETLINKS = "GETLINKS";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    settings: { open: false, copy: true, withTitle: true },
    data: [],
  });
});

chrome.commands.onCommand.addListener(async (_, tab) => {
  if (tab.url.startsWith(CANVAS_SITE)) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getLinks,
    });
  }
});

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case LINKS:
      delete message.type;
      chrome.storage.sync.get(["data", "settings"], function (result) {
        chrome.storage.sync.set({ data: [message, ...result.data] });
        if (result.settings.open) {
          for (link of message.links) {
            chrome.tabs.create({ url: link.link, active: false });
          }
        }
      });
      break;

    case GETLINKS:
      let queryOptions = {
        active: true,
        lastFocusedWindow: true,
      };
      let [tab] = await chrome.tabs.query(queryOptions);
      if (!tab) {
        console.log("broke");
        break;
      } else if (tab.url.startsWith(CANVAS_SITE)) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: getLinks,
        });
      }
      break;
  }
});

function getLinks() {
  const COURSE_ID = /\/courses\/(\d{6})/gm;
  const FILE_ID = /\/files\/(\d{8})/gm;

  const selectedLinks = [];
  let copyText = "";
  let copyTextWithTitle = "";

  const fileRows = document.querySelectorAll(".ef-item-row");

  fileRows.forEach((row) => {
    // 1) Get link
    const linkEl = row.querySelector(".ef-name-col__link");
    if (!linkEl) return;

    // 2) Get the gauge button
    const gaugeBtn = row.querySelector("button.ally-accessibility-score-indicator");
    if (!gaugeBtn) return;

    // 3) Check aria-label
    const ariaLabel = gaugeBtn.getAttribute("aria-label")?.toLowerCase() || "";
    // If ariaLabel includes "low" or "medium", proceed
    if (ariaLabel.includes("low") || ariaLabel.includes("medium")) {
      // 4) Construct the same link you do now
      const courseId = linkEl.baseURI.match(COURSE_ID)?.[0];
      const fileId = linkEl.href.match(FILE_ID)?.[0];
      if (!courseId || !fileId) return;

      const newLink = "https://" + linkEl.host + courseId + fileId;
      const linkText = linkEl.innerText;

      copyText += `${newLink}\n`;
      copyTextWithTitle += `${linkText} | ${newLink}\n`;

      selectedLinks.push({ text: linkText, link: newLink });
    }
  });

  // Send the filtered list
  chrome.runtime.sendMessage({
    type: "LINKS",
    page: window.location.href,
    links: selectedLinks,
    time: Date.now(),
  });

  // Copy to clipboard (unchanged from your code)
  chrome.storage.sync.get(["settings"], function (result) {
    if (result.settings.copy) {
      if (result.settings.withTitle) {
        navigator.clipboard.writeText(copyTextWithTitle);
      } else {
        navigator.clipboard.writeText(copyText);
      }
    }
  });
}

