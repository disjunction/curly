# curly

A wrapper for popular console HTTP client `curl`,
adding following features:

* customizable multiple **contexts** for default settings
* `baseUrl` can be set on context level, so you can use only relative path in console
* context settings can be defined depending on the HTTP method
* shortcut for method calls, e.g. `curly post /pupils --data @./sample_pupil.json`
