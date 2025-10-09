import { useState } from "react";

export default function AnalyzePage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);

    const res = await fetch("http://127.0.0.1:8000/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🧠 AI DevOps Assistant
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <input
            type="file"
            className="mb-3"
            onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                const text = await file.text();
                setContent(text);
                }
            }}
        />

        <textarea
          className="w-full border p-3 rounded-md font-mono text-sm"
          rows={8}
          placeholder="Paste your Dockerfile, YAML, or Terraform config here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h2 className="font-semibold text-blue-800">Summary</h2>
              <p className="text-sm text-gray-800 mt-1">{result.summary}</p>
            </div>

            <div className="p-4 bg-red-50 rounded-md">
              <h2 className="font-semibold text-red-800">Issues</h2>
              <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                {result.issues?.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-md">
              <h2 className="font-semibold text-green-800">Recommendations</h2>
              <ul className="list-disc list-inside text-sm text-gray-800 mt-1">
                {result.recommendations?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
