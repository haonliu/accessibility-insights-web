import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { ReactFCWithDisplayName } from '../../common/react/named-fc';
import { IssueFilingServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { EnvironmentInfo } from './../../common/environment-info-provider';
import { UnifiedCreateIssueDetailsTextData } from './../../common/types/unified-create-issue-details-text-data';
import { SettingsFormProps } from './settings-form-props';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type IssueFilingUrlProvider<Settings> = (
    data: Settings,
    issueData: UnifiedCreateIssueDetailsTextData,
    environmentInfo: EnvironmentInfo,
) => string;

export interface IssueFilingService<Settings = {}> {
    key: string;
    isHidden?: boolean;
    displayName: string;
    settingsForm: ReactFCWithDisplayName<SettingsFormProps<Settings>>;
    buildStoreData: (...params: any[]) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    getSettingsFromStoreData: (data: IssueFilingServicePropertiesMap) => Settings;
    fileIssue: (
        browserAdapter: BrowserAdapter,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: UnifiedCreateIssueDetailsTextData,
        environmentInfo: EnvironmentInfo,
    ) => void;
}
