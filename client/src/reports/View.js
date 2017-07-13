'use strict';

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { withPageHelpers, Title } from '../lib/page'
import { withErrorHandling, withAsyncErrorHandler } from '../lib/error-handling';
import axios from '../lib/axios';
import { ReportState } from '../../../shared/reports';

@translate()
@withPageHelpers
@withErrorHandling
export default class View extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: null
        };
    }

    @withAsyncErrorHandler
    async loadContent() {
        const id = parseInt(this.props.match.params.id);
        const contentResp = await axios.get(`/rest/report-content/${id}`);
        const reportResp = await axios.get(`/rest/reports/${id}`);

        this.setState({
            content: contentResp.data,
            report: reportResp.data
        });
    }

    componentDidMount() {
        this.loadContent();
    }

    render() {
        const t = this.props.t;

        if (this.state.report) {
            if (this.state.report.state === ReportState.FINISHED) {
                return (
                    <div>
                        <Title>{t('Report {{name}}', { name: this.state.report.name })}</Title>

                        <div dangerouslySetInnerHTML={{ __html: this.state.content }}/>
                    </div>
                );
            } else {
                return <div className="alert alert-danger" role="alert">{t('Report not generated')}</div>;
            }
        } else {
            return <div>{t('Loading report ...')}</div>;
        }
    }
}
