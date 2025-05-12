import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useChromeStorageSync } from "use-chrome-storage";

export interface Settings {
  open: boolean;
  copy: boolean;
  withTitle: boolean;
}

function Settings() {
  const [value, setValue] = useChromeStorageSync<Settings>("settings");

  if (!value) return null;

  return (
    <div className="flex flex-col gap-2">
      <Link to={"/"} className="flex items-center gap-1 text-lg font-bold">
        <ChevronLeft />
        <p>Home</p>
      </Link>
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex gap-2">
        <input
          type="checkbox"
          name="open links"
          id="openLinks"
          checked={value.open}
          onClick={() => setValue({ ...value, open: !value.open })}
        />
        <label htmlFor="openLinks">Open links when copied</label>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          name="copy links"
          id="copyLinks"
          checked={value.copy}
          onClick={() => setValue({ ...value, copy: !value.copy })}
        />
        <label htmlFor="copyLinks">Copy links to clipboard when copied</label>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          name="copy links title"
          id="copyLinksTitle"
          checked={value.withTitle}
          onClick={() => setValue({ ...value, withTitle: !value.withTitle })}
        />
        <label htmlFor="copyLinksTitle">Include title with copy</label>
      </div>
    </div>
  );
}

export default Settings;
