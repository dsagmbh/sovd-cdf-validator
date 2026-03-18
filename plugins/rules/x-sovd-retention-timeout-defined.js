
// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const regexps = new RegExp([
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(cyclic-subscriptions|triggers)$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/[^/]+/executions$`,
    `^/updates/[^/]+/(automated|prepare|execute)?$`,
    `^/updates$`, 
].join("|")
);

export default function XSovdRetentionTimeoutDefined() {
  return {
    PathItem: {
      enter(pathItem, ctx) {
        if (regexps.test(ctx.key) && ((pathItem['put'] || pathItem['post']) && !pathItem.hasOwnProperty("x-sovd-retention-timeout"))) {
          ctx.report({
            message: `Operation "${ctx.key}" should define the "x-sovd-retention-timeout" property (cf. §7.3)`,
            location: ["paths", pathItem],
          });
        } 
      },
    },
  };
}
