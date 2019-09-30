// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { IssueFilingServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { IssueFilingUrlProvider } from '../types/issue-filing-service';
import { UnifiedCreateIssueDetailsTextData } from './../../common/types/unified-create-issue-details-text-data';

export const createFileIssueHandler = <Settings>(
    getUrl: IssueFilingUrlProvider<Settings>,
    getSettings: (data: IssueFilingServicePropertiesMap) => Settings,
) => {
    return (
        browserAdapter: BrowserAdapter,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: UnifiedCreateIssueDetailsTextData,
        environmentInfo: EnvironmentInfo,
    ): void => {
        const serviceConfig = getSettings(servicePropertiesMap);

        const url = getUrl(serviceConfig, issueData, environmentInfo);
        browserAdapter.createTab(url);
    };
};
