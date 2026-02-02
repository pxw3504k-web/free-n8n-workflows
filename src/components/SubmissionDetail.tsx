"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function SubmissionDetail({ submission }: { submission: any }) {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030315] to-[#06061a] py-16">
      <div className="max-w-4xl mx-auto bg-[#0b0b1f] border border-white/10 rounded-xl p-8">
        <button onClick={() => router.back()} className="text-sm text-gray-300 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-white mb-2">{submission.title}</h1>
        <p className="text-sm text-gray-400 mb-4">{submission.description}</p>

        <div className="space-y-2">
          <div><strong className="text-gray-300">Author:</strong> <span className="text-white">{submission.author_name || "-"}</span></div>
          <div>
            <strong className="text-gray-300">Author URL:</strong>{' '}
            {submission.author_url ? (
              <a className="text-primary" href={submission.author_url} target="_blank" rel="noreferrer">{submission.author_url}</a>
            ) : (
              <span className="text-white">-</span>
            )}
          </div>
          <div><strong className="text-gray-300">Status:</strong> <span className="text-white">{submission.status}</span></div>
          <div><strong className="text-gray-300">Created:</strong> <span className="text-white">{submission.created_at}</span></div>
        </div>

        <div className="mt-6">
          <h3 className="text-white font-semibold mb-2">Workflow JSON Preview</h3>
          <pre className="bg-black/40 p-4 rounded-md text-xs text-white overflow-auto max-h-72">
            {typeof submission.nodes === "string" ? submission.nodes : JSON.stringify(submission.nodes, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}


