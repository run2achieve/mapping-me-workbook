"use client";

import { useEffect, useState } from "react";

export type Language = "en" | "zh";

const storageKey = "mapping-me-language";
const changeEvent = "mapping-me-language-change";

function readLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(storageKey) === "zh" ? "zh" : "en";
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    setLanguageState(readLanguage());

    function handleChange() {
      setLanguageState(readLanguage());
    }

    window.addEventListener("storage", handleChange);
    window.addEventListener(changeEvent, handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener(changeEvent, handleChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
    document.body.dataset.language = language;
  }, [language]);

  function setLanguage(nextLanguage: Language) {
    window.localStorage.setItem(storageKey, nextLanguage);
    window.dispatchEvent(new Event(changeEvent));
  }

  return { language, setLanguage };
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switch" aria-label="Language">
      <button
        aria-pressed={language === "en"}
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
        type="button"
      >
        EN
      </button>
      <button
        aria-pressed={language === "zh"}
        className={language === "zh" ? "active" : ""}
        onClick={() => setLanguage("zh")}
        type="button"
      >
        中文
      </button>
    </div>
  );
}
