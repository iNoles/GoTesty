package main

import (
	"bytes"
	"io"
	"net/http"
	"time"
)

type APIResponse struct {
    Status     int
    Duration   string
    Headers    map[string][]string
    Body       string
}

func SendRequest(method, url string, headers map[string]string, body string) (*APIResponse, error) {
    start := time.Now()

    req, err := http.NewRequest(method, url, bytes.NewBuffer([]byte(body)))
    if err != nil {
        return nil, err
    }

    for k, v := range headers {
        req.Header.Set(k, v)
    }

    client := &http.Client{Timeout: 15 * time.Second}
    res, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer res.Body.Close()

    resBody, _ := io.ReadAll(res.Body)

    return &APIResponse{
        Status:   res.StatusCode,
        Duration: time.Since(start).String(),
        Headers:  res.Header,
        Body:     string(resBody),
    }, nil
}
