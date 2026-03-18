// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const resourceCollections = [
  "bulk-data",
  "clear-data",
  "communication-logs",
  "configurations",
  "cyclic-subscriptions",
  "data-categories",
  "data-groups",
  "data-lists",
  "data",
  "faults",
  "locks",
  "logs",
  "modes",
  "operations",
  "scripts",
  "status",
  "triggers",
  "updates",
];

export default function XSovdNameDefined() {
  return {
    PathItem: {
      enter(pathItem, ctx) {
        const parts = ctx.key.split("/").filter(Boolean);
        // 'x-sovd-name' is defined as the user friendly name of resources only.
        if (!resourceCollections.includes(parts[parts.length - 1]) && !pathItem.hasOwnProperty("x-sovd-name")) {
          ctx.report({
            message: `Path item "${ctx.key}" is missing the "x-sovd-name" property (cf. §6.2.2)`,
            location: ["paths", pathItem],
          });
        } 
      },
    },
  };
}
