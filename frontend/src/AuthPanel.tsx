import { useState } from "react";

export default function AuthPanel({ onChange }: { onChange: (auth: any) => void }) {
  const [type, setType] = useState("none");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keyName, setKeyName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [location, setLocation] = useState("header");

  const update = () => {
    onChange({
      Type: type,
      Token: token,
      Username: username,
      Password: password,
      KeyName: keyName,
      Key: keyValue,
      Location: location,
    });
  };

  const inputClass =
    "w-full px-3 py-2 rounded-md bg-[#0f172a] border border-gray-600 text-sm";

  return (
    <div className="space-y-3 bg-[#0b1220] border border-gray-700 rounded-lg p-4">

      {/* Auth Type */}
      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          update();
        }}
        className={inputClass}
      >
        <option value="none">No Auth</option>
        <option value="bearer">Bearer Token</option>
        <option value="basic">Basic Auth</option>
        <option value="apikey">API Key</option>
      </select>

      {/* Bearer Token */}
      {type === "bearer" && (
        <input
          className={inputClass}
          placeholder="Token"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            update();
          }}
        />
      )}

      {/* Basic Auth */}
      {type === "basic" && (
        <div className="space-y-2">
          <input
            className={inputClass}
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              update();
            }}
          />
          <input
            className={inputClass}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              update();
            }}
          />
        </div>
      )}

      {/* API Key */}
      {type === "apikey" && (
        <div className="space-y-2">
          <input
            className={inputClass}
            placeholder="Key Name"
            value={keyName}
            onChange={(e) => {
              setKeyName(e.target.value);
              update();
            }}
          />
          <input
            className={inputClass}
            placeholder="Key Value"
            value={keyValue}
            onChange={(e) => {
              setKeyValue(e.target.value);
              update();
            }}
          />
          <select
            className={inputClass}
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              update();
            }}
          >
            <option value="header">Header</option>
            <option value="query">Query</option>
          </select>
        </div>
      )}
    </div>
  );
}
