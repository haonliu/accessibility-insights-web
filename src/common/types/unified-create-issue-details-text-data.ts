// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult, UnifiedRule } from './store-data/unified-data-interface';

export interface UnifiedCreateIssueDetailsTextData {
    pageTitle: string;
    pageUrl: string;
    result: UnifiedResult;
    rule: UnifiedRule;
}
