"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function AnalyzePage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("content", content);

      const res = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze. Please check the backend or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🧠 AI DevOps Assistant
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <textarea
          className="w-full border p-3 rounded-md font-mono text-black text-black-800 placeholder-gray-500"
          rows={8}
          placeholder="Paste your Dockerfile, YAML, or Terraform config here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !content.trim()}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" /> Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-4"
          >
            <div className="p-4 bg-blue-50 rounded-md flex items-start gap-2">
              <FileText className="text-blue-700 mt-1 h-5 w-5" />
              <div>
                <h2 className="font-semibold text-blue-800">Summary</h2>
                <p className="text-sm text-gray-800 mt-1">{result.summary}</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="text-red-700 h-5 w-5" />
                <h2 className="font-semibold text-red-800">Issues</h2>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                {result.issues?.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="text-green-700 h-5 w-5" />
                <h2 className="font-semibold text-green-800">
                  Recommendations
                </h2>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                {result.recommendations?.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
