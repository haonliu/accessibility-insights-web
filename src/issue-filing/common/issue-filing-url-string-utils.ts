// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';

import { getPropertyConfiguration } from '../../common/configs/unified-result-property-configurations';
import { UnifiedCreateIssueDetailsTextData } from '../../common/types/unified-create-issue-details-text-data';

export type IssueUrlCreationUtils = {
    getTitle: (data: UnifiedCreateIssueDetailsTextData) => string;
    getSelectorLastPart: (selector: string) => string;
    standardizeTags: (data: UnifiedCreateIssueDetailsTextData) => string[];
};

const getTitle = (data: UnifiedCreateIssueDetailsTextData): string => {
    const standardTags = standardizeTags(data);
    let prefix = standardTags.join(',');
    if (prefix.length > 0) {
        prefix = prefix + ': ';
    }

    // loop through identifiers
    const conciseIdentifier: string = '';
    forOwn(data.result.identifiers, (propertyData, propertyName) => {
        conciseIdentifier.concat(getPropertyConfiguration(propertyName).conciseText(propertyData));
    });

    return `${prefix}${data.rule.description} (${conciseIdentifier})`;
};

const getSelectorLastPart = (selector: string): string => {
    const splitedSelector = selector.split(';');
    const selectorLastPart = splitedSelector[splitedSelector.length - 1];

    const childCombinator = ' > ';

    if (selectorLastPart.lastIndexOf(childCombinator) > 0) {
        return selectorLastPart.substr(selectorLastPart.lastIndexOf(childCombinator) + childCombinator.length);
    }

    return selectorLastPart;
};

const standardizeTags = (data: UnifiedCreateIssueDetailsTextData): string[] => {
    const guidanceLinkTextTags = data.rule.guidance.map(link => link.text.toUpperCase());
    const tagsFromGuidanceLinkTags = [];
    data.rule.guidance.map(link => (link.tags ? link.tags.map(tag => tagsFromGuidanceLinkTags.push(tag.displayText)) : []));
    return guidanceLinkTextTags.concat(tagsFromGuidanceLinkTags);
};

export const IssueFilingUrlStringUtils = {
    getTitle,
    getSelectorLastPart,
    standardizeTags,
};
