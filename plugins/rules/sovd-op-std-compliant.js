// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

import resolveRef from "./util.js";

const sovdOperationList = [
  {
    // 7.5.2 Retrieve online capability description
    path: new RegExp(`^.*/docs$`),
    supportedMethods: ["GET"],
  },
  {
    // 7.6.2.1 Discover contained Entities
    path: new RegExp(`^/(components|apps|areas)$`),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id", "name", "href"],
        rule: "7.6.2.1",
      },
    },
  },
  {
    // 7.6.2.2 Query sub-Entities of an Entity
    path: new RegExp(
      [
        `^/components/[^/]+(/subcomponents)+$`,
        `^/areas/[^/]+(/subareas)+?$`,
      ].join("|"),
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id", "name", "href"],
        rule: "7.6.2.2",
      },
    },
  },
  {
    // 7.6.2.4 Query related Entities of an Entity
    path: new RegExp(
      [
        `^/areas/[^/]+(?:/subareas/[^/]+)*/?(?:contains)?$`,
        `^/components/[^/]+(?:/subcomponents/[^/]+)*/(hosts|depends-on)$`,
        `^/apps/[^/]+/depends-on$`,
      ].join("|"),
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id", "name", "href"],
        rule: "7.6.2.4",
      },
    },
  },
  {
    // 7.6.3 Query for capabilities of an Entity
    path: new RegExp(
      [
        `^/$`,
        `^/components/[^/]+(?:/subcomponents/[^/]+)*$`,
        `^/apps/[^/]+$`,
      ].join("|"),
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: false,
        properties: ["id", "name"],
        rule: "7.6.3",
      },
    },
  },
  {
    // 7.8.2 Querying faults of an entity
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/faults$`,
    ),
    supportedMethods: ["GET", "DELETE"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["code", "fault_name"],
        rule: "7.8.2",
      },
    },
    delete: {
      204: {},
    },
  },
  {
    // 7.8.3 Querying details of a fault
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/faults/[^/]+$`,
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: false,
        properties: ["item"],
        rule: "7.8.3",
      },
    },
  },
  {
    // 7.9.2.1 Retrieve categories supported by a data resource collection
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data-categories$`,
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["item"],
        rule: "7.9.2.1",
      },
    },
  },
  {
    // 7.9.2.2 Retrieve groups supported by a data resource collection
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data-groups$`,
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id", "category"],
        rule: "7.9.2.2",
      },
    },
  },
  {
    // 7.9.3 Query for data from an Entity
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data$`,
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id", "name", "category"],
        rule: "7.9.3",
      },
    },
  },
  {
    // 7.9.4 & 7.9.6 Read / write a data resource
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data/[^/]+$`,
    ),
    supportedMethods: ["GET", "PUT"],
    get: {
      200: {
        hasItemsArray: false,
        properties: ["id", "data"],
        rule: "7.9.4",
      },
    },
    put: {
      optional: true,
      204: {},
    },
  },
  {
    // 7.9.5 Read multiple data values from an Entity
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data-lists$`,
    ),
    supportedMethods: ["GET", "POST"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id", "items"],
        rule: "7.9.5.1",
      },
    },
    post: {
      201: {
        hasItemsArray: false,
        properties: ["id"],
        rule: "7.9.5.2",
      },
    },
  },
  {
    // 7.9.5.3 Read multiple data values from an Entity
    path: new RegExp(
      [
        `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data-lists/[^/]+$`,
      ].join("|"),
    ),
    supportedMethods: ["GET", "DELETE"],
    get: {
      200: {
        hasItemsArray: false,
        properties: ["id", "items"],
        rule: "7.9.5.3",
      },
    },
    delete: {
      204: {},
    },
  },
  {
    // 7.10 API methods for cyclic-subscriptions
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/cyclic-subscriptions(?:/[^/]+)$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.11 API methods for triggers
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/triggers(?:/[^/]+)$`,
    ),
    supportedMethods: ["GET"],
  },

  {
    // 7.12 API methods for configuration
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/configurations(?:/[^/]+)$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.13 API methods for clearing data
    path: new RegExp(
      `^/components/[^/]+(?:/subcomponents/[^/]+)*/clear-data(?:/(status|cached-data|learned-data|client-defined-resources))?$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.14 & 7.15 API methods for operation & script execution
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)$`,
    ),
    supportedMethods: [ "GET" ],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id", "proximity_proof_required"],
        rule: "7.14.3",
      },
    },
  },
  {
    // 7.14 & 7.15 API methods for operation & script execution
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/[^/]+$`,
    ),
    supportedMethods: [ "GET" ],
    get: {
      200: {
        hasItemsArray: false,
        properties: ["item"],
        rule: "7.14.5",
      },
    },
  },
  {
    // 7.14 & 7.15 API methods for operation & script execution
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/[^/]+/executions$`,
    ),
    supportedMethods: ["GET", "POST"],
    get: {
      200: {
        hasItemsArray: false,
        properties: ["items"],
        rule: "7.14.4",
      },
    },
    post: {
      202: {
        hasItemsArray: false,
        properties: ["id"],
        rule: "7.14.6",
      },
    },
  },
  {
    // 7.14 & 7.15 API methods for control of operations & script execution
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/[^/]+/executions/[^/]+$`,
    ),
    supportedMethods: ["GET", "PUT"],
  },
  {
    //7.16.2 Query for modes of an Entity
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/modes$`,
    ),
    supportedMethods: ["GET"],
    get: {
      200: {
        hasItemsArray: true,
        properties: ["id"],
        rule: "7.16.2",
      },
    },
  },
  {
    // 7.16.3 Retrieve details of a mode
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/modes/[^/]+$`,
    ),
    supportedMethods: ["GET", "PUT"],
    get: {
      200: {
        hasItemsArray: false,
        properties: ["value"],
        rule: "7.16.3",
      },
    },
    put: {
      200: {
        hasItemsArray: false,
        properties: ["id", "value"],
        rule: "7.16.4",
      },
    },
  },
  {
    // 7.17 API methods for locking
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/locks(?:/[^/]+)$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.18 API methods for software update (only on top-level)
    path: new RegExp(
      `^/updates(?:/[^/]+(?:/(automated|status|prepare|execute))?)?$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.19 API methods for restarting an Entity
    path: new RegExp(
      `^/components/[^/]+(?:/subcomponents/[^/]+)*/status(?:/(force-shutdown|shutdown|force-restart|restart|start))?$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.20 API methods for handling of bulk-data
    path: new RegExp(
      `^/components/[^/]+(?:/subcomponents/[^/]+)*/bulk-data(?:/[^/]+)*$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.21 API methods for logging
    path: new RegExp(
      `^/components/[^/]+(?:/subcomponents/[^/]+)*/logs(?:/(entries|config))?$`,
    ),
    supportedMethods: ["GET"],
  },
  {
    // 7.22 API methods for communication-logs
    path: new RegExp(
      `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/communication-logs(?:/[^/]+)$`,
    ),
    supportedMethods: ["GET"],
  },
];

export default function SovdOperationStandardCompliant() {
  return {
    Paths: {
      enter(paths, ctx) {
        const pathKeys = Object.keys(paths);

        for (const path of pathKeys) {
          const operation = sovdOperationList.find((op) => op.path.test(path));
          if (!operation) continue;

          operation.supportedMethods.forEach((method) => {
            const methodLowerCase = method.toLowerCase();
            const pathItem = paths[path][methodLowerCase];

            if (!pathItem && !operation[methodLowerCase]?.optional) {
              ctx.report({
                message: `Endpoint '${path}' must support the HTTP method '${method}' as defined by the standard.`,
                location: { reportOnKey: true },
              });
              return;
            } else if (!pathItem) {
              return;
            }

            const ruleDetails = operation[methodLowerCase];
            if (!ruleDetails) return;

            // Validate if the response schema matches the expected schema

            Object.keys(ruleDetails).forEach((statusCode) => {
              if (statusCode === 204 || statusCode === "204") return; // Skip 204 responses
              if (!pathItem.responses[statusCode]?.content) return;
              const schema = resolveRef(
                pathItem.responses[statusCode].content["application/json"]
                  .schema,
                ctx,
              );

              const statusCodeDetails = ruleDetails[statusCode];

              // Check if 'items' is an array when expected
              if (
                statusCodeDetails.hasItemsArray &&
                schema.properties.items.type !== "array"
              ) {
                ctx.report({
                  message: `Response schema for '${method} ${path}' with status code '${statusCode}' must be of type 'array' (cf. §${statusCodeDetails.rule}).`,
                  location: { reportOnKey: true },
                });
              }

              // Check for required properties
              const propertiesToCheck = resolveRef(
                statusCodeDetails.hasItemsArray
                  ? schema.properties.items.items
                  : schema.properties,
                ctx,
              );

              statusCodeDetails.properties.forEach((prop) => {
                if (
                  !propertiesToCheck.hasOwnProperty(prop) &&
                  !propertiesToCheck.properties?.hasOwnProperty(prop)
                ) {
                  ctx.report({
                    message: `Response schema for '${method} ${path}' with status code '${statusCode}' must include property '${prop}' (cf. §${statusCodeDetails.rule}).`,
                    location: { reportOnKey: true },
                  });
                }
              });
            });
          });
        }
      },
    },
  };
}
