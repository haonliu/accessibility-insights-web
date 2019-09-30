// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import * as React from 'react';

import { CopyIssueDetailsButton } from '../../common/components/copy-issue-details-button';
import { GuidanceLinks } from '../../common/components/guidance-links';
import { GuidanceTags, GuidanceTagsDeps } from '../../common/components/guidance-tags';
import { IssueFilingButton, IssueFilingButtonDeps } from '../../common/components/issue-filing-button';
import { NewTabLink } from '../../common/components/new-tab-link';
import { ToastDeps } from '../../common/components/toast';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { UnifiedResult, UnifiedRule } from '../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { UnifiedCreateIssueDetailsTextData } from '../../common/types/unified-create-issue-details-text-data';
import { CheckType } from '../../injected/components/details-dialog';
import { FixInstructionPanel, FixInstructionPanelDeps } from '../../injected/components/fix-instruction-panel';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { DictionaryStringTo } from '../../types/common-types';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { IssueFilingDialog } from './issue-filing-dialog';

export type IssuesDetailsPaneDeps = ToastDeps &
    IssueFilingButtonDeps &
    FixInstructionPanelDeps &
    GuidanceTagsDeps & {
        issueDetailsTextGenerator: IssueDetailsTextGenerator;
        detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    };

export interface IssuesDetailsPaneProps {
    deps: IssuesDetailsPaneDeps;
    selectedIdToRuleResultMap: DictionaryStringTo<DecoratedAxeNodeResult>;
    pageTitle: string;
    pageUrl: string;
    featureFlagData: FeatureFlagStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    unifiedRule: UnifiedRule;
    unifiedResult: UnifiedResult;
}

interface IssueDetailsState {
    showingCopyToast: boolean;
}

export class IssuesDetailsPane extends React.Component<IssuesDetailsPaneProps, IssueDetailsState> {
    constructor(props: IssuesDetailsPaneProps) {
        super(props);
        this.state = { showingCopyToast: false };
    }

    public render(): JSX.Element {
        return <div>{this.renderContent()}</div>;
    }
    private renderContent(): JSX.Element {
        const ids = Object.keys(this.props.selectedIdToRuleResultMap);
        if (ids.length !== 1) {
            return this.renderSelectMessage();
        }

        const result: DecoratedAxeNodeResult = this.props.selectedIdToRuleResultMap[ids[0]];
        return this.renderSingleIssue(result);
    }

    private renderSelectMessage(): JSX.Element {
        return (
            <div>
                <h2>Failure details</h2>
                <div className="issue-detail-select-message">
                    Select a single failure instance from a group in the table above to see more details here.
                </div>
            </div>
        );
    }

    private getFileIssueDetailsButton(issueData: UnifiedCreateIssueDetailsTextData): JSX.Element {
        return (
            <IssueFilingButton
                deps={this.props.deps}
                issueDetailsData={issueData}
                userConfigurationStoreData={this.props.userConfigurationStoreData}
                needsSettingsContentRenderer={IssueFilingDialog}
            />
        );
    }

    private renderFixInstructionsTitleElement(titleText: string, className: string): JSX.Element {
        return <div className={className}>{titleText}</div>;
    }

    private renderSingleIssue(result: DecoratedAxeNodeResult): JSX.Element {
        const issueData: UnifiedCreateIssueDetailsTextData = {
            pageTitle: this.props.pageTitle,
            pageUrl: this.props.pageUrl,
            result: this.props.unifiedResult,
            rule: this.props.unifiedRule,
        };

        return (
            <div>
                <h2>Failure details</h2>
                <CopyIssueDetailsButton
                    deps={this.props.deps}
                    issueDetailsData={issueData}
                    onClick={this.props.deps.detailsViewActionMessageCreator.copyIssueDetailsClicked}
                />
                {this.getFileIssueDetailsButton(issueData)}
                <table className="issue-detail-table">
                    <tbody>
                        <tr>
                            <td>Rule</td>
                            <td>
                                <NewTabLink href={result.helpUrl}>{result.ruleId}</NewTabLink>
                                {`: ${result.help}`}
                                &nbsp;&nbsp;
                                <GuidanceLinks links={result.guidanceLinks} />
                                <GuidanceTags deps={this.props.deps} links={result.guidanceLinks} />
                            </td>
                        </tr>
                        <tr>
                            <td>How to fix</td>
                            <td className="fix-content">
                                <FixInstructionPanel
                                    deps={this.props.deps}
                                    checkType={CheckType.All}
                                    checks={result.all.concat(result.none)}
                                    renderTitleElement={this.renderFixInstructionsTitleElement}
                                />
                                <FixInstructionPanel
                                    deps={this.props.deps}
                                    checkType={CheckType.Any}
                                    checks={result.any}
                                    renderTitleElement={this.renderFixInstructionsTitleElement}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Snippet</td>
                            <td className="snippet-content">{result.html}</td>
                        </tr>
                        <tr>
                            <td>Path</td>
                            <td className="path-content">{result.selector}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
