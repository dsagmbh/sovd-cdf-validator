// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

import resolveRef from './util.js';

const regexpsGet = new RegExp(
  [
    `^/$`,
    `^/components/[^/]+(?:/subcomponents/[^/]+)*$`,
    `^/apps/[^/]+$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(data|data-lists|faults|cyclic-subscriptions|triggers|configurations|operations|scripts|modes|bulk-data|updates)/[^/]+$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/[^/]+/executions/[^/]+$`,
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/clear-data/status$`,
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/logs/entries$`,
  ].join("|")
);

const regexpsPost = new RegExp(
  [
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(cyclic-subscriptions|triggers)$`,
  ].join("|")
);

const regexpsPut = new RegExp(
  `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/modes/[^/]+$`
);

function validateQueryParamIncludeSchema(parameters, msg, ctx) {
  let hasIncludeSchema = false;
  for (const param of parameters) {
    let resolved = resolveRef(param, ctx);
    if (resolved.name === "include-schema") {
      hasIncludeSchema = true;
    }
  }
  if (!hasIncludeSchema) {
    ctx.report({
      message: `Path "${ctx.key}" must define the query parameter "include-schema" for the ${msg}`,
      location: ["paths", ctx.key],
    });
  }
}

export default function QueryParamIncludeSchemaDefined() {
  return {
    PathItem: {
      enter(pathItem, ctx) {
        if (regexpsGet.test(ctx.key) && pathItem["get"]) {
          validateQueryParamIncludeSchema(
            pathItem["get"].parameters,
            "GET request (cf. §6.2.6)",
            ctx
          );
        }

        if (regexpsPost.test(ctx.key) && pathItem["post"]) {
          validateQueryParamIncludeSchema(
            pathItem["post"].parameters,
            "POST request (cf. §6.2.6)",
            ctx
          );
        }

        if (regexpsPut.test(ctx.key) && pathItem["put"]) {
          validateQueryParamIncludeSchema(
            pathItem["put"].parameters,
            "PUT request (cf. §6.2.6)",
            ctx
          );
        }
      },
    },
  };
}
