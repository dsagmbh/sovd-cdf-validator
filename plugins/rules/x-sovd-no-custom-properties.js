// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const allowedXSovdProperties = [
  "x-sovd-applicability",
  "x-sovd-asynchronous-execution",
  "x-sovd-capabilities", // DEPRECATED
  "x-sovd-cyclic-subscription-supported",
  "x-sovd-data-category",
  "x-sovd-data-groups",
  "x-sovd-enum-translation-ids",
  "x-sovd-fault-display-code",
  "x-sovd-fault-scope",
  "x-sovd-fault-severity",
  "x-sovd-lock-breakable",
  "x-sovd-lock-required", // DEPRECATED
  "x-sovd-lock-scopes", // DEPRECATED
  "x-sovd-mode",
  "x-sovd-name",
  "x-sovd-proximity-proof-required",
  "x-sovd-required-modes", // DEPRECATED
  "x-sovd-retention-timeout",
  "x-sovd-supported-scopes", // DEPRECATED
  "x-sovd-tags",
  "x-sovd-translation-id",
  "x-sovd-unit",
];

function validateProperty(pathItem, key, propertyType, ctx) {
  if (
    key.toLowerCase().startsWith("x-sovd-") &&
    !allowedXSovdProperties.includes(key.toLowerCase())
  ) {
    ctx.report({
      message: `Path item "${ctx.key}" uses reserved ${propertyType} "${key}" (cf. §5.4.5, §7.9.1, §7.14.5)`,
      location: ["paths", pathItem],
    });
  }
}

export default function XSovdNoCustomProperties() {
  return {
    Operation: {
      enter(operation, ctx) {
        Object.keys(operation).some((key) => {
          validateProperty(operation, key, "property", ctx);
        });
      },
    },
    PathItem: {
      enter(pathItem, ctx) {
        Object.keys(pathItem).some((key) => {
          validateProperty(pathItem, key, "property", ctx);
        });

        if (pathItem["get"] === undefined || pathItem["get"].parameters === undefined) {
          return;
        }
        for (const obj in pathItem["get"]?.parameters) {
          if (obj !== undefined && obj.name) {
            validateProperty(pathItem, obj.name, "property", ctx);
          }
        }
      },
    },
  };
}
