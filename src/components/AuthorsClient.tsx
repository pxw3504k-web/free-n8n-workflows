"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DbAuthor, convertDbAuthorToAuthor, AuthorWithUrls, Author } from "@/lib/authors";

const FAKE_AUTHORS: Author[] = [
  {
    name: "n8n Workflows Official",
    name_zh: "n8n 工作流 官方",
    handle: "@ay_official",
    role: "System Admin",
    bio: "The official repository for verified enterprise-grade workflows.",
    bio_zh: "经过验证的企业级工作流官方仓库。",
    count: 3200,
    joined: "2024-01-01",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "DevOps_Master_X",
    name_zh: "Faker小狗",
    handle: "@devops_x",
    role: "Infrastructure Expert",
    bio: "Specializing in CI/CD pipelines, Docker, and Kubernetes automations.",
    bio_zh: "专注于 CI/CD 流水线、Docker 与 Kubernetes 自动化。",
    count: 1250,
    joined: "2024-03-15",
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    name: "AI_Workflow_Bot",
    name_zh: "超级小熊猫",
    handle: "@ai_agent_007",
    role: "LLM Specialist",
    bio: "Building complex chains with OpenAI, Claude, and LangChain.",
    bio_zh: "使用 OpenAI、Claude 和 LangChain 构建复杂链路。",
    count: 880,
    joined: "2024-05-20",
    color: "bg-green-500/10 text-green-400",
  },
  {
    name: "SaaS_Connector",
    name_zh: "郭玲",
    handle: "@api_wizard",
    role: "Integration Guru",
    bio: "Connecting CRM, Notion, and Slack to automate your life.",
    bio_zh: "连接 CRM、Notion 与 Slack，自动化您的工作流程。",
    count: 500,
    joined: "2024-06-10",
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    name: "Crypto_Watcher",
    name_zh: "链上观察者",
    handle: "@chain_link",
    role: "Web3 Developer",
    bio: "Automated trading bots and blockchain monitoring workflows.",
    bio_zh: "自动化交易机器人与区块链监控工作流。",
    count: 200,
    joined: "2024-07-01",
    color: "bg-pink-500/10 text-pink-400",
  },
  {
    name: "N8N_Community_Pick",
    name_zh: "N8N 社区精选",
    handle: "@community_best",
    role: "Curator",
    bio: "Hand-picked high quality workflows from the global community.",
    bio_zh: "来自全球社区的精选高质量工作流。",
    count: 58,
    joined: "2024-08-01",
    color: "bg-yellow-500/10 text-yellow-400",
  },
];

interface AuthorsClientProps {
  dbAuthors?: DbAuthor[];
}

// Component to render bio with clickable links
function BioWithLinks({ 
  bio, 
  websiteUrl, 
  youtubeUrl 
}: { 
  bio: string; 
  websiteUrl?: string | null; 
  youtubeUrl?: string | null;
}) {
  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // If we have explicit URLs from database, use them
  if (websiteUrl || youtubeUrl) {
    const url = websiteUrl || youtubeUrl;
    return (
      <p className="text-sm text-gray-300 mt-4">
        {bio.replace(urlRegex, '').trim() || 'Active workflow contributor.'}
        {' '}
        <a
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {url}
        </a>
      </p>
    );
  }
  
  // Otherwise, detect URLs in bio text and make them clickable
  const parts = bio.split(urlRegex);
  
  return (
    <p className="text-sm text-gray-300 mt-4">
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}

export default function AuthorsClient({ dbAuthors = [] }: AuthorsClientProps) {
  const { t, language } = useLanguage();

  // Convert database authors to display format
  const convertedDbAuthors = dbAuthors.map((dbAuthor, index) => convertDbAuthorToAuthor(dbAuthor, index));
  
  // Merge fake authors and real authors, prioritizing real authors
  const allAuthors = [...convertedDbAuthors, ...FAKE_AUTHORS];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">{t("authors.title")}</h2>
        <p className="text-gray-400 mt-3 max-w-3xl mx-auto">{t("authors.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAuthors.map((a, index) => (
          <div
            key={`${a.handle}-${index}`}
            className={`rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.02)] backdrop-blur-md p-6 h-full ${a.color}`}
            aria-hidden={false}
          >
            <div className="flex items-center gap-4">
              <img
                src={`https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(a.name)}`}
                alt={a.name}
                className="w-14 h-14 rounded-lg border border-white/8"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{language === 'zh' && a.name_zh ? a.name_zh : a.name}</h3>
                  <span className="text-sm text-gray-400">{a.handle}</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{t("authors.role")}: <span className="text-white">{a.role}</span></p>
              </div>
            </div>

            <BioWithLinks 
              bio={language === 'zh' && a.bio_zh ? a.bio_zh : a.bio} 
              websiteUrl={(a as AuthorWithUrls).website_url}
              youtubeUrl={(a as AuthorWithUrls).youtube_url}
            />

            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <div>
                <div className="text-xs">{t("authors.joined")}</div>
                <div className="text-white">{a.joined}</div>
              </div>
              <div className="text-right">
                <div className="text-xs">{t("authors.workflows")}</div>
                <div className="text-white font-semibold text-lg">{a.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


