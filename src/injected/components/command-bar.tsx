// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseButton, Button, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { CopyIssueDetailsButton, CopyIssueDetailsButtonDeps } from '../../common/components/copy-issue-details-button';
import { IssueFilingButton, IssueFilingButtonDeps } from '../../common/components/issue-filing-button';
import { IssueFilingNeedsSettingsHelpText } from '../../common/components/issue-filing-needs-settings-help-text';
import { FileHTMLIcon } from '../../common/icons/file-html-icon';
import { NamedFC } from '../../common/react/named-fc';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { DictionaryStringTo } from '../../types/common-types';
import { DecoratedAxeNodeResult } from '../scanner-utils';
import { UnifiedCreateIssueDetailsTextData } from '../../common/types/unified-create-issue-details-text-data';

export type CommandBarDeps = CopyIssueDetailsButtonDeps & IssueFilingButtonDeps;

export type CommandBarProps = {
    deps: CommandBarDeps;
    onClickInspectButton: (
        event: React.MouseEvent<Button | BaseButton | HTMLDivElement | HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
    ) => void;
    onClickCopyIssueDetailsButton: (event: React.MouseEvent<any, MouseEvent>) => void;
    failedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
    currentRuleIndex: number;
    userConfigurationStoreData: UserConfigurationStoreData;
    shouldShowInspectButtonMessage: () => boolean;
    devToolsShortcut: string;
};

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', props => {
    const renderInspectButton = (): JSX.Element => {
        return (
            <DefaultButton className="insights-dialog-button-inspect" onClick={props.onClickInspectButton}>
                <FileHTMLIcon />
                <div className="ms-Button-label">Inspect HTML</div>
            </DefaultButton>
        );
    };

    const renderIssueButtons = (): JSX.Element => {
        const failedRuleIds: string[] = Object.keys(props.failedRules);
        const ruleName: string = failedRuleIds[props.currentRuleIndex];
        const ruleResult: DecoratedAxeNodeResult = props.failedRules[ruleName];
        const issueData: UnifiedCreateIssueDetailsTextData = {
            pageTitle: document.title,
            pageUrl: document.URL,
            ruleResult,
        };

        return (
            <>
                <CopyIssueDetailsButton deps={props.deps} issueDetailsData={issueData} onClick={props.onClickCopyIssueDetailsButton} />
                {renderFileIssueButton(issueData)}
            </>
        );
    };

    const renderFileIssueButton = (issueData: UnifiedCreateIssueDetailsTextData): JSX.Element => {
        return (
            <IssueFilingButton
                deps={props.deps}
                issueDetailsData={issueData}
                userConfigurationStoreData={props.userConfigurationStoreData}
                needsSettingsContentRenderer={IssueFilingNeedsSettingsHelpText}
            />
        );
    };

    const renderInspectMessage = (): JSX.Element => {
        if (props.shouldShowInspectButtonMessage()) {
            return (
                <div className="insights-dialog-inspect-disabled">
                    {`To use the Inspect HTML button, first open the developer tools (${props.devToolsShortcut}).`}
                </div>
            );
        }
    };

    return (
        <div className="insights-dialog-target-button-container">
            {renderInspectButton()}
            {renderIssueButtons()}
            {renderInspectMessage()}
        </div>
    );
});
