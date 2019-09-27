// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { compact, forOwn } from 'lodash';

import { getPropertyConfiguration } from '../../common/configs/unified-result-property-configurations';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { UnifiedResult } from '../../common/types/store-data/unified-data-interface';
import { StoredInstancePropertyBag, UnifiedRule } from './../../common/types/store-data/unified-data-interface';
import { IssueDetailsBuilder } from './issue-details-builder';
import { MarkupFormatter } from './markup/markup-formatter';

export const createIssueDetailsBuilder = (markup: MarkupFormatter): IssueDetailsBuilder => {
    const getter = (
        environmentInfo: EnvironmentInfo,
        data: CreateIssueDetailsTextData,
        unifiedResult?: UnifiedResult,
        unifiedRule?: UnifiedRule,
    ): string => {
        const result = data.ruleResult;

        const { howToFixSection, link, sectionHeader, snippet, sectionHeaderSeparator, footerSeparator, sectionSeparator } = markup;

        const getSectionFromPropertyBag = (propertyBag: StoredInstancePropertyBag) => {
            const section: string[] = [];
            forOwn(propertyBag, (propertyData, propertyName) => {
                const issueFilingDetailsSection = getPropertyConfiguration(propertyName).issueFilingDetailsSection;
                section.concat(issueFilingDetailsSection(propertyName, propertyData, markup, getSection));
            });
            return section;
        };

        const getSection = (header: string, content: string) => {
            return [sectionHeader(header), sectionHeaderSeparator(), content, sectionSeparator()];
        };

        const lines = [
            getSection('Issue', `${snippet(unifiedRule.description)} (${link(unifiedRule.url, unifiedRule.id)})`),

            getSection('Target application', link(data.pageUrl, data.pageTitle)),

            getSectionFromPropertyBag(unifiedResult.identifiers),

            getSectionFromPropertyBag(unifiedResult.descriptors),

            // need to refactor how to fix section to take typeof CreationData.howToFix
            getSection('How to fix', howToFixSection(result.failureSummary)),

            getSection('Environment', environmentInfo.browserSpec),

            footerSeparator(),

            `This accessibility issue was found using ${title} ` +
                `${environmentInfo.extensionVersion} (axe-core ${environmentInfo.axeCoreVersion}), ` +
                'a tool that helps find and fix accessibility issues. Get more information & download ' +
                `this tool at ${link('http://aka.ms/AccessibilityInsights')}.`,
        ];

        return compact(lines).join('');
    };

    return getter;
};
