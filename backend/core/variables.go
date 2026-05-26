package core

import (
    "regexp"
    "strings"
)

type Variables map[string]string

var varPattern = regexp.MustCompile(`\{\{(.+?)\}\}`)

// ReplaceVariables replaces {{var}} placeholders in a string.
func ReplaceVariables(input string, vars Variables) string {
    return varPattern.ReplaceAllStringFunc(input, func(match string) string {
        key := strings.Trim(match, "{}")
        if val, ok := vars[key]; ok {
            return val
        }
        return match // leave untouched if not found
    })
}

// ApplyVariables applies variable replacement to URL, headers, and body.
func ApplyVariables(url string, headers map[string]string, body string, vars Variables) (string, map[string]string, string) {
    newURL := ReplaceVariables(url, vars)

    newHeaders := make(map[string]string)
    for k, v := range headers {
        newHeaders[k] = ReplaceVariables(v, vars)
    }

    newBody := ReplaceVariables(body, vars)

    return newURL, newHeaders, newBody
}
