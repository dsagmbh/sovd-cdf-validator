// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const regexps = new RegExp(
  [

    // Functions
    `^/functions/.*$`,

    //7.5.2 Retrieve online capability description
    `^.*/docs$`,

    // 7.6.2.1 Discover contained Entities
    `^/(components|apps|areas)`,

    // 7.6.2.2 Query sub-Entities of an Entity
    `^/components/[^/]+(?:/subcomponents/[^/]+)*$`,
    `^/areas(?:/[^/]+(?:/subareas/[^/]+)*)?$`,

    // 7.6.2.3 DEPRECATED — Query related Entities of an Entity
    // Not supported as deprecated

    // 7.6.2.4 Query related Entities of an Entity
    `^/areas/[^/]+(?:/subareas/[^/]+)*/?(?:contains)?$`,
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/(hosts|depends-on)$`,
    `^/apps/[^/]+/depends-on$`,

    // 7.6.3 Query for capabilities of an Entity
    `^/$`,
    `^/components/[^/]+(?:/subcomponents/[^/]+)*$`,
    `^/apps/[^/]+$`,

    // 7.7 Enhancement of API methods for tagged Entities and resources
    // Only query parameters, nothing to define

    // 7.8 API methods for fault handling
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/faults(?:/[^/]+)$`,

    // 7.9 API methods for data resource read / write access
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data(?:/[^/]+)$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data-lists(?:/[^/]+)$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data-categories$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/data-groups$`,

    // 7.10 API methods for cyclic-subscriptions
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/cyclic-subscriptions(?:/[^/]+)$`,

    // 7.11 API methods for triggers
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/triggers(?:/[^/]+)$`,
    
    // 7.12 API methods for configuration
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/configurations(?:/[^/]+)$`,

    // 7.13 API methods for clearing data
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/clear-data(?:/(status|cached-data|learned-data|client-defined-resources))?$`,

    // 7.14 API methods for control of operations
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/operations/[^/]+/executions$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/operations/[^/]+/executions/[^/]+$`,

    // 7.15 API methods for script execution
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/scripts/[^/]+/executions$`,
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/scripts/[^/]+/executions/[^/]+$`,

    // 7.16 API methods for support of target modes
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/modes(?:/[^/]+)$`,

    // 7.17 API methods for locking
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/locks(?:/[^/]+)$`,

    // 7.18 API methods for software update (only on top-level)
    `^/updates(?:/[^/]+(?:/(automated|status|prepare|execute))?)?$`,

    // 7.19 API methods for restarting an Entity
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/status(?:/(force-shutdown|shutdown|force-restart|restart|start))?$`,

    // 7.20 API methods for handling of bulk-data
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/bulk-data(?:/[^/]+)*$`,

    // 7.21 API methods for logging
    `^/components/[^/]+(?:/subcomponents/[^/]+)*/logs(?:/(entries|config))?$`,

    // 7.22 API methods for communication-logs
    `^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/communication-logs(?:/[^/]+)$`,

  ].join("|")
);

export default function PathValidation() {
  return {
    PathItem: {
      enter(pathItem, ctx) {
        const path = ctx.key;

        if (!regexps.test(path)) {
          ctx.report({
            message: `Path "${path}" is not defined by the SOVD standard (cf. §5.3, §5.4)`,
            location: ["paths", path],
          });
        }

      },
    },
  };
}
