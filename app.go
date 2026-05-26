package main

import (
    "context"
    "gotesty/backend/core"
)

type App struct {
    ctx context.Context
}

func NewApp() *App {
    return &App{}
}

func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
}

// This is the function Wails exposes to the frontend
func (a *App) SendRequest(
    method string,
    url string,
    headers map[string]string,
    body string,
    auth core.Auth,
    vars core.Variables,
) (*core.APIResponse, error) {

    newURL, newHeaders, newBody := core.ApplyVariables(url, headers, body, vars)

    opts := core.RequestOptions{
        Method:  method,
        URL:     newURL,
        Headers: newHeaders,
        Body:    newBody,
        Auth:    auth,
    }

    return core.SendRequest(opts)
}