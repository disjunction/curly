# scurl

A wrapper for popular console HTTP client `curl` meant
for humans who work with APIs in console.

It adds following features:

* customizable multiple **contexts** for default settings
* `baseUrl` can be set on context level, so you can use only relative path in console
* shortcut for method calls, e.g. `scurl post /pupils --data @./sample_pupil.json`
* automatic output beautification (primarily for JSON)

## Contexts

Context is a profile for specific service. The contexts are saved as YAML
files in context directory (by default `~/.scurl/contexts`).

It can be treated as an intelligent `.curlrc` and `-K` options which
is automatically applied depending on your session or parameters.

Normally context has a `baseUrl`, some headers
and potentially other default curl options you want to have
on each request. You can also specify **rules** which apply some
of the options based on conditions you specify.

If you're used to `.curlrc` format you can use it inline within context YAML.

Example:
```YAML
baseUrl: http://my.service.com:3000

headers:
  Accept-Language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5

curlrc: |-
  proxy=http://username:password@10.0.0.1:8888
  --trace /tmp/trace_all
  -A "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.2.149.27 Safari/525.13"

test: sdfklajsf
```
