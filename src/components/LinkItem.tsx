import { ChevronDown, ChevronRight, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { SavedLinks } from "../Links";

function LinkItem({
  savedLink,
  handleDelete,
}: {
  savedLink: SavedLinks;
  handleDelete: (e: React.MouseEvent, time: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const [animationParent] = useAutoAnimate();

  function handleGroupCopy(e: React.MouseEvent) {
    e.stopPropagation();

    let copyTextWithTitle = "";
    let copyText = "";

    for (let link of savedLink.links) {
      copyText += `${link.link}\n`;
      copyTextWithTitle += `${link.text} | ${link.link}\n`;
    }

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

  return (
    <div
      className={`flex flex-col gap-1 rounded-md hover:bg-slate-200 transition p-3 ${
        open && "bg-slate-200"
      }`}
      ref={animationParent}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <a
          href={savedLink.page}
          target="_blank"
          className="text-blue-600 underline"
        >
          {savedLink.page.split("folder/")[1].replaceAll(/%20/g, " ")}
        </a>
        <div className="flex items-center gap-2" ref={animationParent}>
          <Copy
            className="p-1 rounded hover:bg-slate-50 transition cursor-pointer"
            onClick={(e) => handleGroupCopy(e)}
          />
          <Trash2
            color="red"
            className="p-1 rounded hover:bg-slate-50 transition cursor-pointer"
            onClick={(e) => handleDelete(e, savedLink.time)}
          />
          {open ? <ChevronDown /> : <ChevronRight />}
        </div>
      </div>
      {open &&
        savedLink.links.map((link) => {
          return (
            <div
              key={link.text}
              className="flex justify-between p-1 items-center"
            >
              <p>{link.text}</p>
              <Copy
                className="p-1 rounded hover:bg-slate-50 transition cursor-pointer"
                onClick={() => navigator.clipboard.writeText(link.link)}
              />
            </div>
          );
        })}
    </div>
  );
}

export default LinkItem;
