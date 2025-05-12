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

  let selectedLinks = [];

  const links = document.querySelectorAll(".ef-name-col__link");

  let copyText = "";
  let copyTextWithTitle = "";

  for (link of links) {
    const courseId = link.baseURI.match(COURSE_ID)[0];
    const fileId = link.href.match(FILE_ID)[0];

    const newLink = "https://" + link.host + courseId + fileId;
    const linkText = link.innerText;

    copyText += `${newLink}\n`;
    copyTextWithTitle += `${linkText} | ${newLink}\n`;

    selectedLinks.push({ text: linkText, link: newLink });
  }

  chrome.runtime.sendMessage({
    type: "LINKS",
    page: window.location.href,
    links: selectedLinks,
    time: Date.now(),
  });

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
