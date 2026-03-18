// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

const isSovdOperation = new RegExp(`^/(components|apps)/[^/]+(?:/subcomponents/[^/]+)*/(operations|scripts)/([^/])+$`)

export default function SovdOperationHasExecutions() {
    return {
        Paths: {
            enter(paths, ctx) {
                const pathKeys = Object.keys(paths);

                pathKeys.forEach((path) => {
                    if (isSovdOperation.test(path)) {
                        const executionsEndpoint = `${path}/executions`;

                        if (!pathKeys.includes(executionsEndpoint)) {
                            ctx.report({
                                message: `Every script/operation must have an execution. Expected to find '${executionsEndpoint}' (cf. §7.14.4, §7.15.7)`,
                                location: { reportOnKey: true },
                            });
                        }

                        const executionIdEndpoint = `${path}/executions/{execution-id}`;

                        if (!pathKeys.includes(executionIdEndpoint)) {
                            ctx.report({
                                message: `Every script/operation must have an execution ID. Expected to find '${executionIdEndpoint}'  (cf. §7.14.5, §7.15.8g)`,
                                location: { reportOnKey: true },
                            });
                        }
                    };
                });
            },
        },
    }
};
