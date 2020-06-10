// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeaderIcon, HeaderIconDeps } from 'common/components/header-icon';
import { NamedFC } from 'common/react/named-fc';
import { TextContent } from 'content/strings/text-content';
import * as React from 'react';
import * as styles from './header.scss';

export type HeaderDeps = { textContent: Pick<TextContent, 'applicationTitle'> } & HeaderIconDeps;

export type HeaderProps = {
    deps: HeaderDeps;
    items?: JSX.Element;
    farItems?: JSX.Element;
    navMenu?: JSX.Element;
    showHeaderTitle?: boolean;
    showFarItems?: boolean;
};

export const Header = NamedFC<HeaderProps>('Header', props => {
    const { applicationTitle } = props.deps.textContent;

    const getHeaderTitle = () => {
        if (props.showHeaderTitle === false) {
            return null;
        } else {
            return (
                <>
                    <HeaderIcon deps={props.deps} />
                    <span className={styles.headerTitle}>{applicationTitle}</span>
                </>
            );
        }
    };

    const getFarItems = () => {
        if (props.showFarItems === false) {
            return null;
        } else {
            return <div className={styles.farItems}>{props.farItems}</div>;
        }
    };

    return (
        <header className={styles.headerBar}>
            {props.navMenu}
            {getHeaderTitle()}
            <div>{props.items}</div>
            <div className={styles.spacer}></div>
            {getFarItems()}
        </header>
    );
});
