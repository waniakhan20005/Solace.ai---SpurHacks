"use client";
import { useState } from "react";

interface SummaryButtonProps {
  transcript: string;
}

export default function SummaryButton({ transcript }: SummaryButtonProps) {
  const [summary, setSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isAddingToNotion, setIsAddingToNotion] = useState(false);
  const [summaryError, setSummaryError] = useState<string>("");
  const [notionError, setNotionError] = useState<string>("");
  const [notionSuccess, setNotionSuccess] = useState<string>("");

  const generateSummary = async () => {
    if (!transcript.trim()) {
      setSummaryError("No transcript available to summarize");
      return;
    }

    setIsGeneratingSummary(true);
    setSummaryError("");

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.output?.summary || data.summary || data.message || "Summary generated successfully");
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummaryError(error instanceof Error ? error.message : 'Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const addToNotion = async () => {
    if (!summary.trim()) {
      setNotionError("No summary available to add to Notion");
      return;
    }

    setIsAddingToNotion(true);
    setNotionError("");
    setNotionSuccess("");

    try {
      const response = await fetch('/api/add-to-notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript, summary }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotionSuccess(data.message || "Successfully added to Notion");
    } catch (error) {
      console.error('Failed to add to Notion:', error);
      setNotionError(error instanceof Error ? error.message : 'Failed to add to Notion');
    } finally {
      setIsAddingToNotion(false);
    }
  };

  return (
    <div className="h-48 lg:h-1/3 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">AI Summary & Recommendations</h2>
        <div className="flex gap-2">
          <button
            onClick={generateSummary}
            disabled={isGeneratingSummary || !transcript.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
          </button>
          {summary && (
            <button
              onClick={addToNotion}
              disabled={isAddingToNotion}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isAddingToNotion ? 'Adding...' : 'Add to Notion'}
            </button>
          )}
        </div>
      </div>
      <div className="text-gray-600 space-y-2">
        {summaryError && (
          <div className="text-red-600 text-sm mb-2">
            Error: {summaryError}
          </div>
        )}
        {notionError && (
          <div className="text-red-600 text-sm mb-2">
            Notion Error: {notionError}
          </div>
        )}
        {notionSuccess && (
          <div className="text-green-600 text-sm mb-2">
            {notionSuccess}
          </div>
        )}
        {summary ? (
          <div className="whitespace-pre-wrap text-sm">
            <h3 className="font-semibold mb-2">AI Summary:</h3>
            {summary}
          </div>
        ) : (
          <p>Your AI-powered summary and next steps will appear here after generating a summary.</p>
        )}
      </div>
    </div>
  );
} 