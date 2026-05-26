package core

import (
    "bytes"
    "encoding/json"
    "strings"
)

// PrettyJSON attempts to format JSON bodies nicely.
func PrettyJSON(raw string) string {
    raw = strings.TrimSpace(raw)
    if raw == "" {
        return ""
    }

    var buf bytes.Buffer
    if err := json.Indent(&buf, []byte(raw), "", "  "); err != nil {
        return raw // not JSON, return as-is
    }

    return buf.String()
}

// DetectContentType returns a simplified type: json, xml, html, text, binary.
func DetectContentType(headers map[string][]string) string {
    ct := ""
    if v, ok := headers["Content-Type"]; ok && len(v) > 0 {
        ct = strings.ToLower(v[0])
    }

    switch {
    case strings.Contains(ct, "application/json"):
        return "json"
    case strings.Contains(ct, "text/html"):
        return "html"
    case strings.Contains(ct, "application/xml") || strings.Contains(ct, "text/xml"):
        return "xml"
    case strings.Contains(ct, "text/"):
        return "text"
    default:
        return "binary"
    }
}

// FormatResponseBody formats based on content type.
func FormatResponseBody(body string, headers map[string][]string) string {
    switch DetectContentType(headers) {
    case "json":
        return PrettyJSON(body)
    default:
        return body
    }
}
