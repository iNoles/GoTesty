import {useState} from 'react';
import {SendRequest} from "../wailsjs/go/main/App.js";

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.github.com");
  const [headers, setHeaders] = useState("{\"Content-Type\": \"application/json\"}");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      const parsedHeaders = JSON.parse(headers);
      const res = await SendRequest(method, url, parsedHeaders, body);
      setResponse(res);
    } catch (err) {
      setResponse({ Status: 0, Body: "Error: Invalid JSON headers" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col font-sans bg-gray-50 p-4">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-blue-700">GoTesty</h1>
        <span className="text-gray-500 italic text-sm">
          Lightweight API Testing Tool
        </span>
      </header>

      {/* Request Panel */}
      <div className="mb-6 space-y-3 bg-white p-4 rounded-lg shadow-md">
        <div className="flex gap-3 items-center">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="border rounded px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="https://api.example.com"
          />

          <button
            onClick={handleSend}
            className={`px-4 py-1 rounded font-semibold text-white transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Headers & Body */}
        <div className="flex gap-3 mt-2">
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="flex-1 border rounded p-2 font-mono text-sm resize-none bg-gray-50 focus:ring-2 focus:ring-blue-300 transition"
            placeholder='Headers JSON: {"Authorization": "Bearer token"}'
            rows={4}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 border rounded p-2 font-mono text-sm resize-none bg-gray-50 focus:ring-2 focus:ring-blue-300 transition"
            placeholder='Request Body JSON'
            rows={4}
          />
        </div>
      </div>

      {/* Response Panel */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-auto">
        {response ? (
          <>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Status:</span>{" "}
              <span className={response.Status >= 200 && response.Status < 300 ? "text-green-600" : "text-red-600"}>
                {response.Status}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Time:</span>{" "}
              <span className="text-gray-600">{response.Duration || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Headers:</span>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(response.Headers, null, 2)}
              </pre>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Body:</span>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {response.Body ? JSON.stringify(JSON.parse(response.Body), null, 2) : "{}"}
              </pre>
            </div>
          </>
        ) : (
          <div className="text-gray-400 italic text-center mt-20">
            Send a request to see the response...
          </div>
        )}
      </div>
    </div>
  );
}

export default App
