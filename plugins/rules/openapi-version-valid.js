// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

export default function OpenAPIVersionValid() {
  return {
    Root: {
      enter(root, ctx) {
        const regexp = new RegExp("^3\\.1(\\.\\d+)?$|^3\\.[2-9]\\.");
        if (!regexp.test(root.openapi)) {
          ctx.report({
            message: `OpenAPI version must be at least 3.1.0 (cf. §6.1)`,
            location: ["paths", root],
          });
        } 
      },
    },
  };
}
