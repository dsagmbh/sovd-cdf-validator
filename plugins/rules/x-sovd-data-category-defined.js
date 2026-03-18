// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const regexp = new RegExp(`^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data/[^/]+$`);

export default function XSovdDataCategoryDefined(
  options // type is String[]
) {
  return {
    PathItem: {
      enter(pathItem, ctx) {
        if (!regexp.test(ctx.key)) {
          return;
        }

        if (pathItem['x-sovd-data-category'] === undefined) {
          ctx.report({
            message: `Data resource "${ctx.key}" must define data category using 'x-sovd-data-category' (cf. §6.2.2)`,
            location: ["paths", ctx.key],
          });
          return;
        }

        if (pathItem['x-sovd-data-category'].startsWith('x-')) {
          return;
        }

        let allowed = [];
        if (options.allowed !== undefined) {
          allowed = options.allowed.concat(['identData', 'currentData', 'storedData', 'sysInfo']);
        } else {
          allowed = ['identData', 'currentData', 'storedData', 'sysInfo'];
        }

        if (!allowed.includes(pathItem['x-sovd-data-category'])) {
          ctx.report({
            message: `Data resource "${ctx.key}" refers to the unknown data category "${pathItem['x-sovd-data-category']}" (cf. §7.9.1)`,
            location: ["paths", ctx.key],
          });
        }
      },
    },
  };
}
