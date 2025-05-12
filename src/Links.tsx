import { Link } from "react-router-dom";
import { useChromeStorageSync } from "use-chrome-storage";
import { Settings } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import LinkItem from "./components/LinkItem";

export interface SavedLinks {
  page: string;
  time: number;
  links: {
    text: string;
    link: string;
  }[];
}

function Links() {
  const [value, setValue] = useChromeStorageSync<SavedLinks[]>("data", []);

  const [animationParent] = useAutoAnimate();

  function handleDelete(e: React.MouseEvent, time: number) {
    e.stopPropagation();
    const newValue = value.filter((val) => val.time !== time);
    setValue(newValue);
  }

  function handleGetLinks() {
    chrome.runtime.sendMessage({ type: "GETLINKS" });
  }

  return (
    <div className="flex flex-col gap-2">
      <nav className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Links</h1>
        <button
          className="px-3 py-2 border-none bg-blue-600 hover:bg-blue-700 rounded active:scale-90 transition text-white font-bold"
          onClick={handleGetLinks}
        >
          Get links
        </button>
        <Link to={"settings"}>
          <Settings />
        </Link>
      </nav>
      <hr />
      <div ref={animationParent} className="flex flex-col gap-2">
        {value.length > 0 ? (
          value.map((savedLink) => {
            return (
              <LinkItem
                savedLink={savedLink}
                handleDelete={handleDelete}
                key={savedLink.time}
              />
            );
          })
        ) : (
          <div className="flex justify-center">
            <p>No links copied. Use the hotkey CTRL+Shift+U...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Links;
