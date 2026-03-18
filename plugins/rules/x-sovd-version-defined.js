// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

export default function XSovdVersionDefined() {
  return {
    Info: {
      enter(info, ctx) {
        if (!info.hasOwnProperty("x-sovd-version")) {
          ctx.report({
            message: `Info is missing the "x-sovd-version" property (cf. §6.2.1)`,
            location: ["paths", info],
          });
        } 
      },
    },
  };
}
