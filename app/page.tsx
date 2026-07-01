"use client";

import Link from "next/link";
import { LanguageToggle, useLanguage } from "@/components/language";

const copy = {
  en: {
    eyebrow: "Mapping Me",
    title: "Workbook Library",
    privacyTitle: "Private by default.",
    privacy:
      "Workbook notes save in this browser on this device. They are not uploaded.",
    available: [
      {
        href: "/workbook/energy_map",
        title: "Energy Map",
        description: "Track daily energy, attention, load, and recovery patterns."
      },
      {
        href: "/workbook/sensory_map",
        title: "Sensory Map",
        description: "Explore sensory channels, profile patterns, and support ideas."
      },
      {
        href: "/workbook/learning_style_map",
        title: "Learning Style Map",
        description: "Notice learning formats, processing styles, and useful scaffolds."
      },
      {
        href: "/workbook/discovering_my_values",
        title: "Discovering My Values",
        description: "Gather small clues about what matters without forcing a final answer."
      },
      {
        href: "/workbook/what_i_love_about_myself",
        title: "What I Love About Myself",
        description: "Gather specific, believable evidence of self-appreciation."
      },
      {
        href: "/workbook/checking_in_with_my_body",
        title: "Checking-In With My Body",
        description: "Notice body signals, sensory load, energy texture, and small needs."
      }
    ],
    developmentTitle: "In development",
    development:
      "To nudge these workbooks forward, contact contact@run2achieve.info.",
    developmentItems: [
      ["Exploring Identity & Beliefs", "Explore self-stories, belonging, language, and beliefs in motion."],
      ["Processing My Emotions", "Make space for feelings, mixed signals, body clues, and gentle next steps."],
      ["Exploring Boundaries", "Notice limits, access needs, honest yeses, and relationship care."],
      ["My Getting-Started Toolkit", "Collect small tools that help you begin when tasks feel sticky or blocked."]
    ]
  },
  zh: {
    eyebrow: "Mapping Me",
    title: "Workbook Library",
    privacyTitle: "默认保存在本机。",
    privacy: "你的 workbook 内容只会保存在当前浏览器和设备里，不会被上传。",
    available: [
      {
        href: "/workbook/energy_map",
        title: "能量地图",
        description: "记录每天的能量、注意力、负荷和恢复模式。"
      },
      {
        href: "/workbook/sensory_map",
        title: "感官地图",
        description: "探索不同感官通道、个人模式和支持方法。"
      },
      {
        href: "/workbook/learning_style_map",
        title: "学习方式地图",
        description: "观察学习输入、处理方式和对你有帮助的脚手架。"
      },
      {
        href: "/workbook/discovering_my_values",
        title: "发现我的价值观",
        description: "收集关于“什么对我重要”的线索，不急着给出最终答案。"
      },
      {
        href: "/workbook/what_i_love_about_myself",
        title: "我喜欢自己的地方",
        description: "收集具体、可信、温柔的自我欣赏证据。"
      },
      {
        href: "/workbook/checking_in_with_my_body",
        title: "和我的身体 check-in",
        description: "观察身体信号、感官负荷、能量质地和小需求。"
      }
    ],
    developmentTitle: "开发中",
    development: "如果你想催更这些 workbook，可以联系 contact@run2achieve.info。",
    developmentItems: [
      ["探索身份与信念", "探索自我故事、归属感、语言和仍在变化的信念。"],
      ["处理我的情绪", "给情绪、混合信号、身体线索和下一小步留出空间。"],
      ["探索边界", "观察限制、access needs、真实的 yes 和关系中的照顾。"],
      ["我的启动工具箱", "收集帮助你从卡住到开始的小工具。"]
    ]
  }
};

export default function Home() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <main className="shell workbook-home" translate="no">
      <header className="topbar">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
        </div>
        <LanguageToggle />
      </header>

      <section className="privacy-note">
        <strong>{t.privacyTitle}</strong> {t.privacy}
      </section>

      <nav className="workbook-library" aria-label="Workbook library">
        {t.available.map((item) => (
          <Link href={item.href} key={item.href}>
            <span>{item.title}</span>
            <p>{item.description}</p>
          </Link>
        ))}
      </nav>

      <section className="development-section" aria-labelledby="development-title">
        <div className="development-note">
          <h2 id="development-title">{t.developmentTitle}</h2>
          <p>{t.development}</p>
        </div>
        <div className="workbook-library">
          {t.developmentItems.map(([title, description]) => (
            <div className="disabled-workbook" aria-disabled="true" key={title}>
              <span>{title}</span>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
