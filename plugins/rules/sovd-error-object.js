// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

import resolveRef from './util.js';

const httpNegativeStatusCode = /^(4\d\d|5\d\d|4[Xx]{2}|5[Xx]{2,3})$/;

const regexps = new RegExp(
  `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(data|configuration)/[^/]+$`
);

export default function XSovdErrorObject() {
  return {
    PathItem: {
      leave(obj, ctx) {
        const path = ctx.key;

        for (const key of Object.keys(obj)) {
          if (!obj[key].responses) {
            continue;
          }
          for (const statusCode of Object.keys(obj[key].responses)) {
            const response = obj[key].responses[statusCode];
            if (!response.content?.["application/json"] || !response.content?.["application/json"].schema) {
              continue;
            }

            let resolved;
            if (response.content["application/json"].schema !== undefined) {
              resolved = resolveRef(response.content["application/json"].schema, ctx);
            } else {
              resolved = resolveRef(response, ctx);
            }
            if (resolved === undefined) {
                continue;
            }
            let dataErrorRequired = regexps.test(path);

            // Check if status code is a negative HTTP status code (4xx or 5xx)
            if (httpNegativeStatusCode.test(statusCode) || statusCode === "default") {
              if (!resolved.properties?.error_code || !resolved.properties?.message) {
                ctx.report({
                  message: `Negative status code does not have an error_code or message property as defined by the SOVD standard (cf. §5.8.3)`,
                  location: ["paths", obj],
                });
              }
            } else if (statusCode === "200" && dataErrorRequired && resolved?.properties?.errors?.items !== undefined) {
              let items = resolveRef(resolved.properties.errors.items, ctx);
              if (!items.properties?.path || !items.properties?.error) {
                ctx.report({
                  message: `Negative status code must have the properties 'path' and 'errors' as defined by the SOVD standard (cf. §5.8.3)`,
                  location: ["paths", obj],
                });
              }
            }
          }
        }
      },
    },
  };
}
