// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';

import { EnvironmentInfo } from '../../../common/environment-info-provider';
import { UnifiedCreateIssueDetailsTextData } from '../../../common/types/unified-create-issue-details-text-data';
import { createIssueDetailsBuilder } from '../../common/create-issue-details-builder';
import { HTTPQueryBuilder } from '../../common/http-query-builder';
import { IssueDetailsBuilder } from '../../common/issue-details-builder';
import { IssueFilingUrlStringUtils, IssueUrlCreationUtils } from '../../common/issue-filing-url-string-utils';
import { HTMLFormatter } from '../../common/markup/html-formatter';
import { AzureBoardsIssueFilingSettings, AzureBoardsWorkItemType } from './azure-boards-issue-filing-settings';

const buildTags = (createIssueData: UnifiedCreateIssueDetailsTextData, standardTags: string[]): string => {
    const tags = ['Accessibility', title, `rule: ${createIssueData.rule.id}`, ...standardTags];
    return tags.join('; ');
};

export const createAzureBoardsIssueFilingUrlProvider = (
    stringUtils: IssueUrlCreationUtils,
    issueDetailsBuilder: IssueDetailsBuilder,
    queryBuilderProvider: () => HTTPQueryBuilder,
) => {
    return (
        settingsData: AzureBoardsIssueFilingSettings,
        issueData: UnifiedCreateIssueDetailsTextData,
        environmentInfo: EnvironmentInfo,
    ) => {
        const titleField = stringUtils.getTitle(issueData);
        const standardTags = stringUtils.standardizeTags(issueData);
        const tags = buildTags(issueData, standardTags);
        const body = issueDetailsBuilder(environmentInfo, issueData);

        let bodyField: string = '[Microsoft.VSTS.TCM.ReproSteps]';
        let workItemType: AzureBoardsWorkItemType = 'Bug';

        if (settingsData.issueDetailsField === 'description') {
            bodyField = '[System.Description]';
            workItemType = 'Issue';
        }

        return queryBuilderProvider()
            .withBaseUrl(`${settingsData.projectURL}/_workitems/create/${workItemType}`)
            .withParam('fullScreen', 'true')
            .withParam('[System.Title]', titleField)
            .withParam('[System.Tags]', tags)
            .withParam(bodyField, body)
            .build();
    };
};

export const azureBoardsIssueFilingUrlProvider = createAzureBoardsIssueFilingUrlProvider(
    IssueFilingUrlStringUtils,
    createIssueDetailsBuilder(HTMLFormatter),
    () => new HTTPQueryBuilder(),
);
