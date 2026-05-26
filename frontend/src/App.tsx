import { useState } from "react";
import { SendRequest } from "../wailsjs/go/main/App.js";
import AuthPanel from "./AuthPanel.js";
import PrettyResponse from "./PrettyResponse.js";

export default function App() {
  // Top-level tabs
  const [activeTab, setActiveTab] = useState("request");

  // Request sub-tabs
  const [requestTab, setRequestTab] = useState("auth");

  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.github.com");
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [body, setBody] = useState("");
  const [auth, setAuth] = useState<any>({ Type: "none" });

  // ⭐ Query Params
  const [queryParams, setQueryParams] = useState<
    { key: string; value: string; enabled: boolean }[]
  >([]);

  const addQueryParam = () => {
    setQueryParams((prev) => [...prev, { key: "", value: "", enabled: true }]);
  };

  const updateQueryParam = (
  index: number,
  field: "key" | "value" | "enabled",
  value: string | boolean
) => {
  setQueryParams((prev) => {
    const copy = [...prev];
    copy[index] = { ...copy[index], [field]: value };
    return copy;
  });
};

  const deleteQueryParam = (index: number) => {
    setQueryParams((prev) => prev.filter((_, i) => i !== index));
  };

  // ⭐ Variables
  const [variables, setVariables] = useState<{ [key: string]: string }>({});

  const updateVar = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const deleteVar = (key: string) => {
    setVariables((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const addVar = () => updateVar("newVar", "");

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);

    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(headers);
    } catch {
      setResponse({ Status: 0, Body: "Invalid JSON in headers" });
      setLoading(false);
      return;
    }

    // ⭐ Build final URL with query params
    let finalUrl = url;

    const activeParams = queryParams.filter((p) => p.enabled && p.key.trim() !== "");

    if (activeParams.length > 0) {
      const qs = activeParams
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join("&");

      finalUrl = url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
    }

    try {
      const res = await SendRequest(method, finalUrl, parsedHeaders, body, auth, variables);
      setResponse(res);
    } catch {
      setResponse({ Status: 0, Body: "Error sending request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans">

      {/* HEADER */}
      <header className="px-6 py-4 bg-[#1e293b] border-b border-gray-700 shadow flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand">GoTesty</h1>
        
        <span className="text-xs text-gray-400 tracking-wide">
          Lightweight API Testing Tool
        </span>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">

        {/* ⭐ TOP-LEVEL TABS */}
        <div className="flex gap-6 border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab("request")}
            className={`pb-2 text-sm ${
              activeTab === "request"
                ? "text-brand border-b-2 border-brand"
                : "text-gray-400"
            }`}
          >
            Request
          </button>

          <button
            onClick={() => setActiveTab("variables")}
            className={`pb-2 text-sm ${
              activeTab === "variables"
                ? "text-brand border-b-2 border-brand"
                : "text-gray-400"
            }`}
          >
            Variables
          </button>
        </div>

        {/* ⭐ REQUEST TAB */}
        {activeTab === "request" && (
          <section className="bg-[#1e293b] border border-gray-700 rounded-xl shadow-lg p-6 space-y-6">

            {/* Method + URL + Send */}
            <div className="flex gap-3">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-28 px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 text-sm"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
              </select>

              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 text-sm"
                placeholder="https://api.example.com"
              />

              <button
                onClick={send}
                disabled={loading}
                className={`px-5 py-2 rounded-md font-semibold text-white bg-brand hover:bg-brand-dark transition ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending…" : "Send"}
              </button>
            </div>

            {/* ⭐ REQUEST SUB-TABS */}
            <div className="flex gap-6 border-b border-gray-700 pb-2">
              <button
                onClick={() => setRequestTab("auth")}
                className={`pb-2 text-sm ${
                  requestTab === "auth"
                    ? "text-brand border-b-2 border-brand"
                    : "text-gray-400"
                }`}
              >
                Auth
              </button>

              <button
                onClick={() => setRequestTab("headers")}
                className={`pb-2 text-sm ${
                  requestTab === "headers"
                    ? "text-brand border-b-2 border-brand"
                    : "text-gray-400"
                }`}
              >
                Headers
              </button>

              <button
                onClick={() => setRequestTab("body")}
                className={`pb-2 text-sm ${
                  requestTab === "body"
                    ? "text-brand border-b-2 border-brand"
                    : "text-gray-400"
                }`}
              >
                Body
              </button>

              <button
                onClick={() => setRequestTab("query")}
                className={`pb-2 text-sm ${
                  requestTab === "query"
                    ? "text-brand border-b-2 border-brand"
                    : "text-gray-400"
                }`}
              >
                Query Params
              </button>
            </div>

            {/* ⭐ SUB-TAB CONTENT */}
            {requestTab === "auth" && (
              <div className="rounded-lg border border-gray-700 bg-[#0b1220] p-5">
                <AuthPanel onChange={setAuth} />
              </div>
            )}

            {requestTab === "headers" && (
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="h-48 w-full px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 font-mono text-sm"
                placeholder='{"Authorization": "Bearer {{token}}"}'
              />
            )}

            {requestTab === "body" && (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="h-48 w-full px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 font-mono text-sm"
                placeholder='{"email": "{{email}}"}'
              />
            )}

            {/* ⭐ QUERY PARAMS TAB */}
            {requestTab === "query" && (
              <div className="space-y-4">
                {queryParams.length === 0 && (
                  <p className="text-gray-400 text-sm">No query parameters added.</p>
                )}

                {queryParams.map((param, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={(e) =>
                        updateQueryParam(index, "enabled", e.target.checked)
                      }
                    />

                    <input
                      className="px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 text-sm w-1/3"
                      placeholder="key"
                      value={param.key}
                      onChange={(e) => updateQueryParam(index, "key", e.target.value)}
                    />

                    <input
                      className="px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 text-sm flex-1"
                      placeholder="value"
                      value={param.value}
                      onChange={(e) => updateQueryParam(index, "value", e.target.value)}
                    />

                    <button
                      onClick={() => deleteQueryParam(index)}
                      className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <button
                  onClick={addQueryParam}
                  className="px-3 py-2 bg-brand rounded hover:bg-brand-dark text-sm"
                >
                  Add Query Param
                </button>
              </div>
            )}

            {/* ⭐ RESPONSE */}
            <section className="bg-[#1e293b] border border-gray-700 rounded-xl shadow-lg p-6 min-h-[240px]">
              {response ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={
                        response.Status >= 200 && response.Status < 300
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {response.Status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="font-semibold">Headers:</span>
                    <pre className="mt-2 p-3 rounded-md bg-[#0f172a] border border-gray-700 text-sm overflow-auto">
                      {JSON.stringify(response.Headers, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <span className="font-semibold">Body:</span>
                    <PrettyResponse body={response.Body} headers={response.Headers} />
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic text-center py-20">
                  Send a request to see the response…
                </div>
              )}
            </section>
          </section>
        )}

        {/* ⭐ VARIABLES TAB */}
        {activeTab === "variables" && (
          <section className="bg-[#1e293b] border border-gray-700 rounded-xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Variables</h2>

            {Object.keys(variables).length === 0 && (
              <p className="text-gray-400 text-sm">No variables defined.</p>
            )}

            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex gap-3 items-center">
                <input
                  className="px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 text-sm w-1/3"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    deleteVar(key);
                    updateVar(newKey, value);
                  }}
                />
                <input
                  className="px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 text-sm flex-1"
                  value={value}
                  onChange={(e) => updateVar(key, e.target.value)}
                />
                <button
                  onClick={() => deleteVar(key)}
                  className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}

            <button
              onClick={addVar}
              className="px-3 py-2 bg-brand rounded hover:bg-brand-dark text-sm"
            >
              Add Variable
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
