// SPDX-FileCopyrightText: 2026 DSA - Daten- und Systemtechnik GmbH Aachen
// SPDX-License-Identifier: MIT
//
// Licensed under the MIT License.
// See the LICENSE file in the project root for license information.
//
// Additional notices are provided in the NOTICE file in the project root.

import OpenAPIVersionValid from './rules/openapi-version-valid.js';
import OperationRequiresLocationHeader from './rules/operation-requires-location-header.js';
import PathValidation from './rules/sovd-path-validation.js';
import QueryParamIncludeSchemaDefined from './rules/query-param-include-schema.js';
import QueryParamArrayDefinition from './rules/query-param-array-defintion.js';
import XSovdDataCategoryDefined from './rules/x-sovd-data-category-defined.js';
import XSovdErrorObject from './rules/sovd-error-object.js';
import XSovdNameDefined from './rules/x-sovd-name-defined.js';
import XSovdNoCustomProperties from './rules/x-sovd-no-custom-properties.js';
import XSovdOnlyDefinedHeaders from './rules/x-sovd-headers-only-defined.js';
import XSovdRetentionTimeoutDefined from './rules/x-sovd-retention-timeout-defined.js';
import XSovdVersionDefined from './rules/x-sovd-version-defined.js';
import XSovdVersionInfoDefined from './rules/x-sovd-version-info-defined.js';
import SovdOperationHasExecutions from './rules/sovd-op-has-execution.js';
import SovdOperationStandardCompliant from './rules/sovd-op-std-compliant.js';

export default function sovdRulesPlugin() {
  return {
    id: 'sovd-rules',
    rules: {
      oas3: {
        'openapi-version-valid': OpenAPIVersionValid,
        'operation-requires-location-header': OperationRequiresLocationHeader,
        'operation-has-executions': SovdOperationHasExecutions,
        'operation-standard-compliant': SovdOperationStandardCompliant,
        'query-param-include-schema-defined': QueryParamIncludeSchemaDefined,
        'query-param-array-definition': QueryParamArrayDefinition,
        'sovd-error-object': XSovdErrorObject,
        'sovd-path-structure': PathValidation,
        'x-sovd-data-category-defined': XSovdDataCategoryDefined,
        'x-sovd-headers-only-defined': XSovdOnlyDefinedHeaders,
        'x-sovd-name-defined': XSovdNameDefined,
        'x-sovd-no-custom-properties': XSovdNoCustomProperties,
        'x-sovd-retention-timeout-defined': XSovdRetentionTimeoutDefined,
        'x-sovd-version-defined': XSovdVersionDefined,
        'x-sovd-version-info-defined': XSovdVersionInfoDefined,
      },
    },
    configs: {
      recommended: {
        rules: {
          'info-license': 'warn',
          'security-defined': 'warn',
          'operation-summary': 'off',
          'operation-operationId': 'off',
          'operation-4xx-response': 'warn',
          'sovd-rules/openapi-version-valid': 'error',
          'sovd-rules/query-param-include-schema-defined': 'error',
          'sovd-rules/query-param-array-definition': 'error',
          'sovd-rules/operation-has-executions': 'error',
          'sovd-rules/operation-standard-compliant': 'error',
          'sovd-rules/sovd-error-object': 'error',
          'sovd-rules/sovd-path-structure': 'error',
          'sovd-rules/x-sovd-data-category-defined': 'error',
          'sovd-rules/x-sovd-headers-only-defined': 'error',
          'sovd-rules/x-sovd-name-defined': 'error',
          'sovd-rules/x-sovd-no-custom-properties': 'error',
          'sovd-rules/x-sovd-retention-timeout-defined': 'warn',
          'sovd-rules/x-sovd-version-defined': 'error',
          'sovd-rules/x-sovd-version-info-defined': 'error',
        },
      },
    },
  };
}
