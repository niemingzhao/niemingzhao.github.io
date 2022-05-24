---
uuid: efca6dd3-5b4c-a9a1-abf2-609d9a0e4e5c
title: Reverse Proxy Script for Cloudflare Workers
date: 2019-01-01 08:00:00
author: 聂明照
categories:
  - 技术
tags:
  - Cloudflare
toc: false
sticky: 200
thumbnail: //images.niemingzhao.top/image/2022/05/25/wu_1g3rhoja8ioo11kmdd81knm11si6.png
---

This is a reverse proxy script running on cloudflare workers, which is made and used by myself. It is mainly used to assist in consulting and downloading learning materials.

<!-- more -->

```javascript
/**
 * Proxy-Workers
 * Version: 1.0.0
 * Description: Reverse Proxy Script for Cloudflare Workers.
 * Author: niemingzhao (https://github.com/niemingzhao)
 * Date: 2022-05-21
 * License: GPLv3
 * Warning: THIS SCRIPT IS FOR LEARNING PURPOSES ONLY!
 */
const BLOCKED_REGION = ["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AR", "AT", "AU", "AZ", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BR", "BS", "BW", "BY", "BZ", "CA", "CF", "CG", "CH", "CK", "CL", "CM", "CO", "CR", "CS", "CU", "CY", "CZ", "DE", "DJ", "DK", "DO", "DZ", "EC", "EE", "EG", "ES", "ET", "FI", "FJ", "FR", "GA", "GB", "GD", "GE", "GF", "GH", "GI", "GM", "GN", "GR", "GT", "GU", "GY", "HK", "HN", "HT", "HU", "ID", "IE", "IL", "IN", "IQ", "IR", "IS", "IT", "JM", "JO", "JP", "KE", "KG", "KH", "KP", "KR", "KT", "KW", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "MG", "ML", "MM", "MN", "MO", "MS", "MT", "MU", "MV", "MW", "MK", "MX", "MY", "MZ", "NA", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PR", "PT", "PY", "QA", "RO", "RU", "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN", "SO", "SR", "ST", "SV", "SY", "SZ", "TD", "TG", "TH", "TJ", "TM", "TN", "TO", "TR", "TT", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VC", "VE", "VN", "YE", "YU", "ZA", "ZM", "ZR", "ZW"];
const BLOCKED_IP_ADDRESS = ["0.0.0.0", "127.0.0.1"];
const BLOCKED_WEBSITE = ["google.com", "youtube.com", "facebook.com", "twitter.com", "instagram.com", "netflix.com"];
const ENTRY_POINT_HTML = `<html><form>` + `<p>Upstream (*): <input type="url" placeholder="https://domain.tld" name="service_host" required autofocus /></p>` + `<p>Replace_Dict: <input type="text" placeholder='{"//domain.tld":""}' name="replace_dict" pattern="^\\{.*\\}$" /></p>` + `<p><input type="submit" value="Submit" /> <input type="reset" value="Reset" /></p>` + `<p>Click the Submit button to transfer the parameters.</p>` + `</form></html>`;

const escape_regexp = (string = "") => string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/gi, "\\$&");

addEventListener("fetch", (event) => event.respondWith(handle_request(event.request)));

async function handle_request(request) {
  let response, response_text;

  const region = (request.headers.get("CF-IPCountry") || "").toUpperCase();
  const ip_address = request.headers.get("CF-Connecting-IP") || "";
  const request_url = new URL(request.url);

  if (/^\/\$help\/?$/gi.test(request_url.pathname)) {
    response = new Response(
      `Usage:
      1. Accelerate access to jsDelivr: https://*.example.workers.dev/$jsdelivr/npm/jquery@3.2.1/dist/jquery.min.js.
      2. Accelerate overseas assets download: https://*.example.workers.dev/$upstream/https://github.com/jquery/jquery/archive/refs/heads/main.zip.
      3. Accelerate overseas website loading: https://*.example.workers.dev/$reset, Input the upstream URL and submit.
      (Note: Parameter 'replace_dict' can be used in conjunction with $upstream to accelerate internal links. For github, input Upstream of 'https://github.com' and Replace_Dict of '{"github.githubassets.com":"*.example.workers.dev/$upstream/https://github.githubassets.com","avatars.githubusercontent.com":"*.example.workers.dev/$upstream/https://avatars.githubusercontent.com"}'.)
      `,
      { status: 200 }
    );
  } else if (BLOCKED_REGION.includes(region)) {
    response = new Response("Access denied: Service is not available in your region yet.", { status: 403 });
  } else if (BLOCKED_IP_ADDRESS.includes(ip_address)) {
    response = new Response("Access denied: Your IP address is blocked.", { status: 403 });
  } else if (/^\/\$jsdelivr\//gi.test(request_url.pathname)) {
    const service_url = "https://cdn.jsdelivr.net" + request_url.pathname.replace(/^\/\$jsdelivr\//gi, "/") + request_url.search + request_url.hash;
    response = await fetch(service_url, request);
  } else if (/^\/\$upstream\//gi.test(request_url.pathname)) {
    const service_url = request_url.pathname.replace(/^\/\$upstream\//gi, "").replace(/(?<=(https?:))\/+/gi, "//") + request_url.search + request_url.hash;
    if (!/^https?:\/\/\S+$/gi.test(service_url)) {
      response = new Response("Invalid upstream URL.", { status: 400 });
    } else {
      response = await fetch(service_url, request);
    }
  } else if (/^\/\$reset\/?$/gi.test(request_url.pathname)) {
    const service_host = decodeURIComponent(request_url.searchParams.get("service_host") || "");
    const replace_dict = decodeURIComponent(request_url.searchParams.get("replace_dict") || "");
    if (!/^https?:\/\/\S+$/gi.test(service_host)) {
      response = new Response(ENTRY_POINT_HTML, { headers: { "Content-Type": "text/html" } });
    } else if (BLOCKED_WEBSITE.reduce((acc, cur) => acc || service_host.includes(cur), false)) {
      response = new Response("Access denied: The upstream website is blocked.", { status: 403 });
    } else if (replace_dict && !/^\{.*\}$/gi.test(replace_dict)) {
      response = new Response("Invalid replace_dict value.", { status: 400 });
    } else {
      try {
        await PROXY_KV.put(ip_address + "_proxy_service_host", encodeURIComponent(service_host));
        await PROXY_KV.put(ip_address + "_proxy_replace_dict", encodeURIComponent(replace_dict));
        response = Response.redirect(request_url.origin, 301);
      } catch (err) {
        response = new Response(`Failed to reset the proxy settings.\n${err.stack || err}`, { status: 500 });
      }
    }
  } else {
    const proxy_service_host = decodeURIComponent((await PROXY_KV.get(ip_address + "_proxy_service_host")) || "");
    const proxy_replace_dict = decodeURIComponent((await PROXY_KV.get(ip_address + "_proxy_replace_dict")) || "");

    if (!/^https?:\/\/\S+$/gi.test(proxy_service_host)) {
      response = Response.redirect(request_url.origin + "/$reset", 301);
    } else {
      let temp_service_url = proxy_service_host + request_url.pathname + request_url.search + request_url.hash;
      const service_url = new URL(temp_service_url);
      let temp_replace_dict = {};
      try {
        temp_replace_dict = JSON.parse(proxy_replace_dict);
      } catch (err) {
        temp_replace_dict = {};
      }
      const replace_dict = new Map(Object.entries(temp_replace_dict));

      const replace_host = (string, origin_url, target_url) => {
        return string
          .replace(RegExp(escape_regexp(origin_url.origin), "gi"), target_url.origin)
          .replace(RegExp("(?<![0-9A-z\\.\\-])(" + escape_regexp(origin_url.host) + "|\\.?" + escape_regexp(origin_url.host.replace(/.*?(?=([0-9A-z\-]+\.[A-z]+$))/gi, "")) + ")(?![0-9A-z\\.\\-\\:])", "gi"), target_url.host)
          .replace(RegExp("(?<![0-9A-z\\.\\-])(" + escape_regexp(origin_url.hostname) + "|\\.?" + escape_regexp(origin_url.hostname.replace(/.*?(?=([0-9A-z\-]+\.[A-z]+$))/gi, "")) + ")(?![0-9A-z\\.\\-\\:])", "gi"), target_url.hostname);
      };

      const request_method = request.method.toUpperCase();
      const request_headers = new Headers(request.headers);
      if (request_headers.get("Host")) request_headers.set("Host", service_url.host);
      if (request_headers.get("Origin")) request_headers.set("Origin", service_url.origin);
      if (request_headers.get("Referer")) request_headers.set("Referer", service_url.origin);
      for (let [name, value] of request_headers.entries()) {
        request_headers.set(name, replace_host(value, request_url, service_url));
      }
      const request_body = !["GET", "HEAD"].includes(request_method) ? await request.text() : null;

      response = await fetch(service_url, { method: request_method, headers: request_headers, body: request_body });

      const response_status = response.status;
      const response_headers = new Headers(response.headers);
      response_headers.set("Cache-Control", "no-cache");
      response_headers.set("Access-Control-Allow-Origin", "*");
      response_headers.set("Access-Control-Allow-Credentials", true);
      response_headers.delete("Content-Security-Policy");
      response_headers.delete("Content-Security-Policy-Report-Only");
      response_headers.delete("Clear-Site-Data");
      for (let [name, value] of response_headers.entries()) {
        response_headers.set(name, replace_host(value, service_url, request_url));
      }
      const response_body = response.body;

      if (/websocket/gi.test(response_headers.get("Upgrade"))) return response;

      if (/(text\/html|text\/css|\/javascript|\/x\-javascript|\/ecmascript|application\/json)/gi.test(response_headers.get("Content-Type"))) {
        response_text = await response.text();
        response_text = replace_host(response_text, service_url, request_url);
        for (let [name, value] of replace_dict.entries()) {
          response_text = response_text.replaceAll(name, value);
        }
        if (/text\/html/gi.test(response_headers.get("Content-Type"))) {
          response_text = response_text.replace(/integrity=("|').*?("|')/gi, "").replace(/crossorigin=("|').*?("|')/gi, "");
        }
      } else {
        response_text = response_body;
      }

      response = new Response(response_text, { status: response_status, headers: response_headers });
    }
  }

  return response;
}
```
