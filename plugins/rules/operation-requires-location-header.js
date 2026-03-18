// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const post201Regexps = new RegExp(
  [
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(data-lists|cyclic-subscriptions|triggers|scripts|locks|communication-logs)$`,
    `^/updates$`, 
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/bulk-data(?:/[^/]+)*$`,
  ].join("|")
);

const post202Regexps = new RegExp(
  [
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/[^/]+/executions$`,
  ].join("|")
);

const put202Regexps = new RegExp(
  [
    `^/updates(?:/[^/]+(?:/(automated|status|prepare|execute))?)?$`,
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/clear-data(?:/(status|cached-data|learned-data|client-defined-resources))?$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/[^/]+/executions/[^/]+$`,    
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/status(?:/(force-shutdown|shutdown|force-restart|restart|start))?$`,
  ].join("|")
);


export default function OperationRequiresLocationHeader() {
  return {
    PathItem: {
      enter(pathItem, ctx) {
        if (!post201Regexps.test(ctx.key) && !post202Regexps.test(ctx.key) && !put202Regexps.test(ctx.key) && !(pathItem['put'] || pathItem['post'])) {
          return;
        }

        // Operation and script executions do not require Location header for synchronous executions
        if (post202Regexps.test(ctx.key) && pathItem.post?.responses?.['200'] && !pathItem.post?.responses?.['202']) {
          return;
        }

        if (post201Regexps.test(ctx.key) && !pathItem.post?.responses?.['201']?.headers?.Location) {
          ctx.report({
            message: `Path "${ctx.key}" requires a Location header in the 201 response for the POST request (cf. §6.2.5)`,
            location: ["paths", ctx.key],
          });
        } else if (post202Regexps.test(ctx.key) && !pathItem.post?.responses?.['202']?.headers?.Location) {
          ctx.report({
            message: `Path "${ctx.key}" requires a Location header in the 202 response for the POST request (cf. §6.2.5)`,
            location: ["paths", ctx.key],
          });
        } else if (put202Regexps.test(ctx.key) && !pathItem.put?.responses?.['202']?.headers?.Location) {
          ctx.report({
            message: `Path "${ctx.key}" requires a Location header in the 202 response for the PUT request (cf. §6.2.5)`,
            location: ["paths", ctx.key],
          });
        }
      },
    },
  };
}
