// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

export default function XSovdVersionInfoDefined() {
  return {
    PathItem: {
      enter(pathItem, ctx) {
        const path = ctx.key;

        if (path.endsWith('/version-info')) {
          ctx.report({
            message: `version-info resource is not allowed to be part of the CDF (cf. §5.6)`,
            location: ["paths", path],
          });
        }

      },
    },
  };
}
