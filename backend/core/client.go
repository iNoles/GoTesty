package core

import (
    "bytes"
    "compress/gzip"
    "io"
    "net/http"
    "strings"
    "time"
)

type APIResponse struct {
    Status   int
    Duration string
    Headers  map[string][]string
    Body     string
}

type RequestOptions struct {
    Method  string
    URL     string
    Headers map[string]string
    Body    string
    Auth    Auth
    Timeout time.Duration
}

func SendRequest(opts RequestOptions) (*APIResponse, error) {
    start := time.Now()

    // Default timeout if none provided
    if opts.Timeout == 0 {
        opts.Timeout = 15 * time.Second
    }

    // Apply authentication before building request
    opts.URL = ApplyAuth(opts.Headers, opts.URL, opts.Auth)

    // Build request
    req, err := http.NewRequest(opts.Method, opts.URL, bytes.NewBufferString(opts.Body))
    if err != nil {
        return nil, err
    }

    // Apply headers
    for k, v := range opts.Headers {
        req.Header.Set(k, v)
    }

    client := &http.Client{
        Timeout: opts.Timeout,
    }

    // Execute request
    res, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer res.Body.Close()

    var reader io.Reader = res.Body

    // Handle gzip responses
    if strings.Contains(res.Header.Get("Content-Encoding"), "gzip") {
        gz, err := gzip.NewReader(res.Body)
        if err == nil {
            defer gz.Close()
            reader = gz
        }
    }

    bodyBytes, _ := io.ReadAll(reader)

    return &APIResponse{
        Status:   res.StatusCode,
        Duration: time.Since(start).String(),
        Headers:  res.Header,
        Body:     string(bodyBytes),
    }, nil
}
