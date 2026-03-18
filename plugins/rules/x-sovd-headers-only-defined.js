// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const xSovdAllowedHeaders = [
  "x-sovd-retention-timeout",
  "x-sovd-mode"
];

export default function XSovdOnlyDefinedHeaders() {
  return {
    Header: {
      enter(header, ctx) {
        if (ctx.key.toLowerCase().startsWith("x-sovd-") && !xSovdAllowedHeaders.includes(ctx.key.toLowerCase())) {
          ctx.report({
            message: `The header "${ctx.key}" is not allowed as the prefix "x-sovd-" is reserved by the standard (cf. §6.2.5, §7.3).`,
            location: ["paths", info],
          });
        } 
      },
    },
  };
}
