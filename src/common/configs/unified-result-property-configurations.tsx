// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixWebCardRow } from '../../DetailsView/components/cards/how-to-fix-card-row';
import { PathCardRow } from '../../DetailsView/components/cards/path-card-row';
import { SnippetCardRow } from '../../DetailsView/components/cards/snippet-card-row';
import { FixInstructionProcessor } from '../../injected/fix-instruction-processor';
import { MarkupFormatter } from '../../issue-filing/common/markup/markup-formatter';
import { ReactFCWithDisplayName } from '../react/named-fc';
import { IssueFilingUrlStringUtils } from '../../issue-filing/common/issue-filing-url-string-utils';

export type PropertyType = 'css-selector' | 'how-to-fix-web' | 'snippet';
export const AllPropertyTypes: PropertyType[] = ['css-selector', 'how-to-fix-web', 'snippet'];

export interface CardRowDeps {
    fixInstructionProcessor: FixInstructionProcessor;
}

export interface CardRowProps {
    deps: CardRowDeps;
    index: number;
    propertyData: any;
}

export type IssueFilingDetailsSection = (
    propertyKey: string,
    propertyValue: string,
    markup: MarkupFormatter,
    getSection: (header: string, content: string) => string[],
) => string[];

export interface PropertyConfiguration {
    cardRow: ReactFCWithDisplayName<CardRowProps>;
    issueFilingDetailsSection?: IssueFilingDetailsSection;
    conciseText?: (value: any) => string;
}

export const howToFixConfiguration: PropertyConfiguration = {
    cardRow: HowToFixWebCardRow,
};

export const cssSelectorConfiguration: PropertyConfiguration = {
    cardRow: PathCardRow,
    issueFilingDetailsSection: (
        _: string,
        propertyValue: string,
        markup: MarkupFormatter,
        getSection: (header: string, content: string) => string[],
    ) => {
        return getSection('Element Path', propertyValue);
    },
    conciseText: (selector: string) => {
        return IssueFilingUrlStringUtils.getSelectorLastPart(selector);
    },
};

export const snippetConfiguration: PropertyConfiguration = {
    cardRow: SnippetCardRow,
    issueFilingDetailsSection: (
        _: string,
        propertyValue: string,
        markup: MarkupFormatter,
        getSection: (header: string, content: string) => string[],
    ) => {
        return getSection('Snippet', propertyValue);
    },
};

type PropertyIdToConfigurationMap = {
    [key in PropertyType]: PropertyConfiguration;
};
const propertyIdToConfigurationMap: PropertyIdToConfigurationMap = {
    'css-selector': cssSelectorConfiguration,
    'how-to-fix-web': howToFixConfiguration,
    snippet: snippetConfiguration,
};

export function getPropertyConfiguration(id: string): Readonly<PropertyConfiguration> {
    return propertyIdToConfigurationMap[id];
}
