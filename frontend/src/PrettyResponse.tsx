import { useState } from "react";

export default function PrettyResponse({
  body,
  headers,
}: {
  body: any;
  headers: any;
}) {
  const [mode, setMode] = useState<"pretty" | "raw">("pretty");

  //
  // Normalize BODY so React can render it safely
  //
  let normalizedBody = body;

  if (typeof body === "object") {
    try {
      normalizedBody = JSON.stringify(body, null, 2);
    } catch {
      normalizedBody = String(body);
    }
  } else if (typeof body !== "string") {
    normalizedBody = String(body);
  }

  //
  // Normalize CONTENT-TYPE for both Web Edition + Desktop Edition
  //
  const rawContentType =
    headers?.["Content-Type"] ||
    headers?.["content-type"] ||
    headers?.["Content-type"] ||
    "";

  const contentType = Array.isArray(rawContentType)
    ? rawContentType[0]
    : rawContentType;

  const isJSON = contentType.includes("application/json");
  const isHTML = contentType.includes("text/html");
  const isXML =
    contentType.includes("application/xml") ||
    contentType.includes("text/xml");

  //
  // PRETTY FORMATTING
  //
  let formatted = normalizedBody;

  if (mode === "pretty") {
    if (isJSON) {
      try {
        formatted = JSON.stringify(JSON.parse(normalizedBody), null, 2);
      } catch {
        formatted = normalizedBody;
      }
    } else if (isXML) {
      formatted = formatXML(normalizedBody);
    } else if (isHTML) {
      formatted = normalizedBody;
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mode Switch */}
      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded text-sm ${
            mode === "pretty"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-200"
          }`}
          onClick={() => setMode("pretty")}
        >
          Pretty
        </button>

        <button
          className={`px-3 py-1 rounded text-sm ${
            mode === "raw"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-200"
          }`}
          onClick={() => setMode("raw")}
        >
          Raw
        </button>
      </div>

      {/* Viewer */}
      <pre className="flex-1 bg-[#0f172a] text-gray-100 p-3 rounded overflow-auto text-sm whitespace-pre-wrap">
        {formatted}
      </pre>
    </div>
  );
}

//
// XML PRETTY FORMATTER
//
function formatXML(xml: string) {
  try {
    const PADDING = "  ";
    let formatted = "";
    let pad = 0;

    xml
      .replace(/(>)(<)(\/*)/g, "$1\r\n$2$3")
      .split("\r\n")
      .forEach((node) => {
        let indent = 0;

        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        }

        formatted += PADDING.repeat(pad) + node + "\r\n";
        pad += indent;
      });

    return formatted;
  } catch {
    return xml;
  }
}
