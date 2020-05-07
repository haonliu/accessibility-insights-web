// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { ManualTestStatus, ManualTestStatusData } from '../../../common/types/manual-test-status';
import { DictionaryStringTo } from '../../../types/common-types';
import { BaseLeftNav, BaseLeftNavLink } from '../base-left-nav';
import {
    AssessmentLinkBuilderDeps,
    LeftNavLinkBuilder,
    OverviewLinkBuilderDeps,
} from './left-nav-link-builder';
import { NavLinkHandler } from './nav-link-handler';

export type AssessmentLeftNavDeps = {
    leftNavLinkBuilder: LeftNavLinkBuilder;
    navLinkHandler: NavLinkHandler;
} & OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps;

export type AssessmentLeftNavProps = {
    deps: AssessmentLeftNavDeps;
    selectedKey: string;
    assessmentsProvider: AssessmentsProvider;
    assessmentsData: DictionaryStringTo<ManualTestStatusData>;
    featureFlagStoreData: FeatureFlagStoreData;
};

export type AssessmentLeftNavLink = {
    status: ManualTestStatus;
} & BaseLeftNavLink;

export const AssessmentLeftNav = NamedFC<AssessmentLeftNavProps>('AssessmentLeftNav', props => {
    const { deps, selectedKey, assessmentsProvider, assessmentsData, featureFlagStoreData } = props;

    const { navLinkHandler, leftNavLinkBuilder } = deps;

    let links = [];
    links.push(
        leftNavLinkBuilder.buildOverviewLink(
            deps,
            navLinkHandler.onOverviewClick,
            assessmentsProvider,
            assessmentsData,
            0,
        ),
    );

    if (featureFlagStoreData[FeatureFlags.reflowUI]) {
        links = links;
    } else {
        links = links.concat(
            leftNavLinkBuilder.buildAssessmentTestLinks(
                deps,
                navLinkHandler.onAssessmentTestClick,
                assessmentsProvider,
                assessmentsData,
                1,
            ),
        );
    }

    return <BaseLeftNav selectedKey={selectedKey} links={links} />;
});
