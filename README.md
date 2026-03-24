# Introduction

SOVD specific rules for validating SOVD capability description
using Redocly.

# Installation and Usage

Redocly is installed using

```[shell]
npx --node-options='--max-old-space-size=10240' @redocly/cli@latest lint --config .\sovd-validator.yml .\openapi-spec.json
```

The option `--node-options='--max-old-space-size=10240'` is required for the large OpenAPI specifications expected for SOVD.

Download the release and install the package using npm (add `-g` for global installation):

```bash
npm install dsagmbh-sovd-redocly-rules-x.x.x.tgz
```

Afterwards, you can use the custom rules in your Redocly configuration file as follows:

```
plugins:
  - '@dsagmbh/sovd-redocly-rules/plugins/sovd-rules.js'

extends:
  - sovd-rules/recommended

rules:
  sovd-rules/x-sovd-retention-timeout-defined: error
```

This configuration loads the plugin as well as the recommended configuration for SOVD. In addition, the rule `x-sovd-retention-timeout` is changed to `error` severity, as it is only set to `warn` in the recommended configuration.

# Rule definitions

## Rules supported

| Rule                                 | Description                                                                                                   | Severity |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------- |
| `openapi-version-valid`              | Ensures that OpenAPI version is at least 3.1.0                                                                | error    |
| `operation-requires-location-header` | Certain SOVD operations, e.g., creation of an execution, require a Location header                            | error    |
| `operation-has-executions`           | Ensures that for each operation or script the executions can be accessed                                      | error    |
| `operation-standard-compliant`       | Validates whether a path has the required operations and that the operation conforms to the expected response | error    |
| `query-param-include-schema-defined` | Ensures that the query parameter `include-schema` is defined for certain requests                             | error    |
| `query-param-array-definition`       | Ensures that query parameters of type array are defined using the right style correctly                       | error    |
| `sovd-error-object`                  | Ensures that error objects comply to the SOVD standard                                                        | error    |
| `sovd-path-structure`                | Validate that paths comply to the endpoints defined in the standard (any path segment starting with x- is ignored)                                          | error    |
| `x-sovd-data-category-defined`       | `x-sovd-data-category` must be defined for data resources and match the defined ones                          | error    |
| `x-sovd-headers-only-defined`        | validates that `X-SOVD-` is only as part of headers defined by the standard                                   | error    |
| `x-sovd-name-defined`                | Ensure that the property `x-sovd-name` is defined for a path                                                  | error    |
| `x-sovd-no-custom-properties`        | Disallow the use of custom properties starting with `x-sovd-`                                                 | error    |
| `x-sovd-retention-timeout-defined`   | Ensures that the property `x-sovd-retention-timeout` is defined for a path                                    | warn     |
| `x-sovd-version-defined`             | Ensure that the property `x-sovd-version` is defined for the info property                                    | error    |
| `x-sovd-version-info-defined`        | Ensure that the resource `version-info` is not defined in the CDF                                             | error    |

## Severity levels for OpenAPI rules

The recommended configuration changes the severity of the following OpenAPI rules, as they are not relevant for SOVD capability descriptions:

- `info-license` &rarr; `warn`: License information is often omitted in SOVD capability descriptions, as they are typically not published as public APIs.
- `security-defined` &rarr; `warn`: Security schemes are often not defined in SOVD capability descriptions, as they are typically not published as public APIs.
- `operation-summary` &rarr; `off`: API documentation are typically not generated for an SOVD capability descriptions.
- `operation-operationId` &rarr; `off`: Commonly there is no skeleton generated for the operations defined by a capability descriptions.
- `operation-4xx-response` &rarr; `off`: As SOVD typically returns a generic error object, the definition of the default 'catch-all' response is typically sufficient.

## Rule `x-sovd-data-category-defined`

The rule checks for the categories defined by the standard. In addition, custom categories can be defined using the `allowed` option:

```
  sovd-rules/x-sovd-data-category-defined:
    severity: error
    allowed:
      - x-oem-storeData
```

## Rules not yet covered

- Unit definitions
- Internationalization of enums
- x-sovd-tags/name

# Helpers for implementing rule definitions

## Resolving $ref with Caching

By default, Redocly does not resolve `$ref` references when validating rules. 
This means that if a rule needs to access the content of a `$ref`, it will only
see the reference itself, not the actual content. To access the content of a
`$ref`, you can use the `resolveRef` helper function. This function takes a
reference and a context object, and returns the resolved content of the reference.:

```javascript
import resolveRef from "./util.js";

// ...

let resolved = resolveRef(response.content["application/json"].schema, ctx);
```
