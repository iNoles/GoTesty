package core

import (
    "encoding/base64"
    "net/url"
)

type AuthType string

const (
    AuthNone   AuthType = "none"
    AuthBearer AuthType = "bearer"
    AuthBasic  AuthType = "basic"
    AuthAPIKey AuthType = "apikey"
)

type Auth struct {
    Type     AuthType `json:"type"`
    Token    string   `json:"token,omitempty"`    // Bearer
    Username string   `json:"username,omitempty"` // Basic
    Password string   `json:"password,omitempty"`
    Key      string   `json:"key,omitempty"`      // API Key
    KeyName  string   `json:"keyName,omitempty"`
    Location string   `json:"location,omitempty"` // header | query
}

// ApplyAuth mutates headers and may return a modified URL.
func ApplyAuth(headers map[string]string, rawURL string, auth Auth) string {
    switch auth.Type {

    case AuthBearer:
        if auth.Token != "" {
            headers["Authorization"] = "Bearer " + auth.Token
        }

    case AuthBasic:
        if auth.Username != "" || auth.Password != "" {
            encoded := base64.StdEncoding.EncodeToString([]byte(auth.Username + ":" + auth.Password))
            headers["Authorization"] = "Basic " + encoded
        }

    case AuthAPIKey:
        if auth.Key != "" && auth.KeyName != "" {
            switch auth.Location {
            case "header":
                headers[auth.KeyName] = auth.Key

            case "query":
                u, err := url.Parse(rawURL)
                if err == nil {
                    q := u.Query()
                    q.Set(auth.KeyName, auth.Key)
                    u.RawQuery = q.Encode()
                    return u.String()
                }
            }
        }
    }

    return rawURL
}
