// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

export default function QueryParamArrayDefinition() {
  return {
    Parameter: {
      enter(item, ctx) {
        if (item.schema && item.schema.type === "array" && item.style !== "form" && item.explode !== true) {
          ctx.report({
            message: `Query parameter "${item.name}" must use style 'form' and explode true (cf. §6.2.6)`,
            location: ["paths", ctx.key, "parameters", item.name],
          });
        }
      },
    },
  };
}
