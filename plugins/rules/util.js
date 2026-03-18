// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

let resolvedRefs = {}

export default function resolveRef(obj, ctx) {
  if (obj["$ref"] === undefined) {
    return obj;
  }  
  if (resolvedRefs[obj["$ref"]] !== undefined) {
    return resolvedRefs[obj["$ref"]];
  }

  let resolvedNode = ctx.resolve({ "$ref": obj["$ref"] });
  if (resolvedNode.node === undefined) {
    ctx.report({
      message: `Invalid OpenAPI definition: ${obj["$ref"]} could not be resolved.`,
      location: ["paths", obj],
    });
    return undefined;
  }
  resolvedRefs[obj["$ref"]] = resolvedNode.node;
  return resolvedNode.node;
}