
import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import './index.css';
import { Breadcrumb } from 'antd';



export default class BreadcrumbSelf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // routes: this.props.routes
        }
    }

    itemRender = (route, params, routes, paths) => {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
    }

    render() {
        const { routes } = this.props
        return <Breadcrumb itemRender={this.itemRender} routes={routes} />
    }
}