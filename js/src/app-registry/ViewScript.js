//@flow
import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Page from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import Breadcrumbs, {BreadcrumbsItem} from '@atlaskit/breadcrumbs';

import {addScript, updateScript, deleteScript } from './redux/actions';
import {scriptSelectorFactory} from './redux/selectors';
import type {RegistryScriptType} from './types';
import {RegistryScript} from './RegistryScript';

import {RouterLink} from '../common/ak/RouterLink';
import {RegistryMessages} from '../i18n/registry.i18n';
import {CommonMessages} from '../i18n/common.i18n';
import {registryService} from '../service/services';
import {DeleteDialog} from '../common/script-list/DeleteDialog';
import {NotFoundPage} from '../common/script-list/NotFoundPage';


type Props = {
    id: number,
    script?: RegistryScriptType,
    deleteScript: typeof deleteScript,
    history: any
};

type State = {
    isDeleting: boolean
};

class ViewScriptInternal extends React.PureComponent<Props, State> {
    state = {
        isDeleting: false
    };

    _toggleDelete = () => this.setState(state => ({ isDeleting: !state.isDeleting }));

    _doDelete = () => registryService
        .deleteScript(this.props.id)
        .then(() => this.props.history.push('/'));

    render() {
        const {script} = this.props;
        const {isDeleting} = this.state;

        return (
            <Page>
                <PageHeader
                    breadcrumbs={
                        <Breadcrumbs>
                            <BreadcrumbsItem
                                text="Workflow script registry"
                                href="/"

                                //$FlowFixMe https://bitbucket.org/atlassian/atlaskit-mk-2/issues/91/breadcrumbsitem-component-weird-type
                                component={RouterLink}
                            />
                        </Breadcrumbs>
                    }
                >
                    {script ? script.name : 'Unknown script'}
                </PageHeader>
                {script ?
                    <RegistryScript script={script} collapsible={false} onDelete={this._toggleDelete}/> :
                    <NotFoundPage/>
                }
                {isDeleting && script &&
                    <DeleteDialog
                        id={script.id}
                        name={script.name}

                        deleteItem={this.props.deleteScript}
                        onConfirm={this._doDelete}
                        onClose={this._toggleDelete}

                        i18n={{
                            heading: RegistryMessages.deleteScript,
                            areYouSure: CommonMessages.confirmDelete
                        }}
                    />
                }
            </Page>
        );
    }
}

export const ViewScript = withRouter(
    connect(
        (): * => {
            const scriptSelector = scriptSelectorFactory();
            //$FlowFixMe
            return (state, props) => ({
                script: scriptSelector(state, props)
            });
        },
        { addScript, updateScript, deleteScript }
    )(ViewScriptInternal)
);