/*
 * @Author					: vincent.zhang 
 * @Date					: 2017-08-26 18:13:05 
 * @overview				: 
 * @Last Modified time		: 2017-08-26 18:13:05 
 */
import './index.scss'
import React, { Component } from 'react'
import moment from 'moment'
import NomalForm from 'Component/Schema/NomalForm'
import CollapseForm from 'Component/Schema/CollapseForm'
import { browserHistory } from 'react-router'
import _ from "lodash";
import { _format } from '../../Util'

import {
    message, Tabs, Table, Form, Icon, Input, Button, Select, Row, Col, Spin, Modal, Pagination
} from 'antd'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
import { fetch } from 'Ajax'
import { warpParams } from 'Pages/Component/utils'


class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: Object.keys(this.props.search)[0],
            searchValue: null
        }
    }

    _onSearchSubmit(event) {
        event.preventDefault();
        this.props.onSubmit();
    }

    _onSearchKeyChange(value) {
        this.setState({
            searchKey: value
        });
    }

    _onSearchValueChange(e) {
        this.setState({
            searchValue: e.target.value
        });
    }

    getSearchData() {
        let search = {};
        if (this.state.searchKey != null && this.state.searchValue != null && this.state.searchValue.trim() != "") {
            search[this.state.searchKey] = this.state.searchValue;
        }
        return search;
    }

    render() {
        let search = this.props.search;
        return (
            <div className="searchform">
                <form onSubmit={this._onSearchSubmit.bind(this)}>
                    <Select className="searchselector" value={this.state.searchKey} onChange={this._onSearchKeyChange.bind(this)}>
                        {Object.keys(search).map(key => <Option value={key}>{search[key]}</Option>)}
                    </Select>
                    <Input className="searchinput" value={this.state.searchValue} onChange={this._onSearchValueChange.bind(this)} placeholder="请输入查询关键字" />
                    <span className="searchbutton" onClick={this._onSearchSubmit.bind(this)}>搜索</span>
                </form>
            </div>
        )
    }
}

export default class QueryTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            loadingTable: true,
            totalSize: 0,
            pageSize: 10,
            pageNum: 1
        }
        this.fetchMetaData()
    }
    componentWillReceiveProps(nextProps) {
        // 也许复用，也行重新刷新
        // if (nextProps.pageConfig.targetObj != null) {
        //     this.setState({
        //         targetObject: nextProps.pageConfig.targetObj
        //     }) 
        // }
    }
    async fetchMetaData() {
        let queryMetaSource = this.props.pageConfig.source.queryMeta;
        if (queryMetaSource == null) {
            this.state.loading = false;
            this.state.value = {
                "filter": undefined,
                "search": undefined,
                "tab": undefined
            };
            this.fetchQueryData()
            return;
        }

        let locationQuery = this.props.router == null ? null : this.props.router.location.query;
        let params = warpParams(this.props.pageConfig.targetObj, locationQuery, queryMetaSource.params);
        //meta filter 逻辑
        let filterConfig = this.props.pageConfig.filterConfig;
        if (filterConfig != null && filterConfig.params != null) {
            let filterParams = warpParams(this.props.pageConfig.targetObj, locationQuery, filterConfig.params);
            params.filter = filterParams;
        }

        let { code, value } = await fetch(queryMetaSource.url, queryMetaSource.method, params);
        if (code == 200) {
            let loading = false
            let hiddentab = this.props.pageConfig.options == null ? false : this.props.pageConfig.options.hiddentab == true;
            if (hiddentab || !Object.keys(value.tab).length) value.tab = undefined
            if (!Object.keys(value.search).length) value.search = undefined
            if (!Object.keys(value.filter).length) value.filter = undefined
            let currentTab = null;
            if (value.tab != null) {
                if (this.props.pageConfig.urltabkey != null) {
                    console.log(this.props.pageConfig.urltabkey);
                    let taburl = locationQuery[this.props.pageConfig.urltabkey];
                    if (taburl != null && value.tab[taburl] != null) {
                        currentTab = taburl;
                    }
                }
                if (currentTab == null) {
                    currentTab = Object.keys(value.tab)[0];
                }
            }
            this.setState({ loading, queryMeta: value, currentTab: currentTab }, () => {
                this.fetchQueryData()
            })
        }
    }

    fetchQueryData = async (opt_forcepage) => {
        let pageNum = opt_forcepage > 0 ? opt_forcepage : this.state.pageNum;
        let loadingTable = true,
            params = {
                "filter": {},
                "search": {},
                "tab": {},
                pageNum: pageNum,
                pageSize: this.state.pageSize,
            }, activeTab
        this.setState({ loadingTable })

        if (this.state.currentTab != null) {
            params.tab[this.state.currentTab] = true
        }
        if (this.refs.searchform != null) {
            params.search = this.refs.searchform.getSearchData();
        }

        let querySource = this.props.pageConfig.source.query;
        let locationQuery = this.props.router == null ? null : this.props.router.location.query;
        let configParams = warpParams(this.props.pageConfig.targetObj, locationQuery, querySource.params);
        for (var key in configParams) {
            if (params[key] != null) {
                params[key] = _.merge(params[key], configParams[key]);
            } else {
                params[key] = configParams[key]
            }
        }
        //meta filter 逻辑
        let { queryMeta } = this.state;
        if (queryMeta != null && queryMeta.filter != null) {
            let filter = {};
            for (let key in queryMeta.filter) {
                if (queryMeta.filter[key].value != null) {
                    filter[key] = queryMeta.filter[key].value;
                }
            }
            params.filter = filter;
        }

        let { code, value } = await fetch(querySource.url, querySource.method, params);
        if (code == 200) {
            let loadingTable = false
            let totalSize = value && value.totalSize || 0
            this.setState({ loadingTable, queryData: value, totalSize, pageNum: pageNum })
        }
    }

    onFilterFieldChange(key, value) {
        const { queryMeta } = this.state;
        if (queryMeta == null) return null;
        let filterData = queryMeta.filter == null ? {} : queryMeta.filter;
        filterData[key] = { value: value };
        this.handleFilterChange(filterData);
    }
    handleFilterChange(filterData) {
        //合并状态到链接
        let locationQuery = this.props.router == null ? {} : this.props.router.location.query;
        let filterConfig = this.props.pageConfig.filterConfig;
        for (var key in filterConfig) {
            let urlkey = filterConfig[key].urlkey == null ? key : filterConfig[key].urlkey;
            if (filterData[key] != null && filterData[key].value != null) {
                locationQuery[urlkey] = filterData[key].value;
            }
        }
        browserHistory.push({
            pathname: this.props.router.location.pathname,
            query: locationQuery
        })
    }
    getFilterUI() {
        let filterConfig = this.props.pageConfig.filterConfig;
        filterConfig = filterConfig == null ? {} : filterConfig;
        const { queryMeta } = this.state;
        if (queryMeta == null) return null;
        let filterData = queryMeta.filter == null ? {} : queryMeta.filter;

        let formUIs = [];
        for (var filterkey in filterData) {
            let itemConfig = filterConfig[filterkey];
            let itemData = filterData[filterkey];
            if (itemConfig == null) continue;
            if (itemConfig.hidden == true) continue;

            let filterLabel = itemData.label;
            let filterValue = itemData.value;
            let filterName = itemData.name;

            if (itemData.objectEnums != null) {
                formUIs.push(
                    <FormItem
                        label={filterLabel}
                        validateStatus={''}
                        help={''}
                    >
                        <Select dropdownMatchSelectWidth={false} style={{ width: 120 }} placeholder="请选择" defaultValue={itemData.value} onChange={this.onFilterFieldChange.bind(this, filterkey)}>
                            {Object.keys(itemData.objectEnums).map(key => <Option value={itemData.objectEnums[key].value}>{itemData.objectEnums[key].title}</Option>)}
                        </Select>
                    </FormItem>
                )
                formUIs.push(<br />);
            } else if (itemConfig.readOnly == true) {
                if (itemData.value != null) {
                    formUIs.push(
                        <FormItem
                            label={filterLabel}
                            validateStatus={''}
                            help={''}
                        >
                            <span>{itemData.title}</span>
                        </FormItem>
                    )
                    formUIs.push(<br />);
                }
            }
        }

        if (formUIs.length == 0) {
            return null;
        }

        return (
            <Form layout="inline" onChange={this.handleFilterChange.bind(this)}>
                { formUIs }
            </Form>
        );
    }

    //tab逻辑
    _onTabChange(tabkey) {
        this.setState({ currentTab: tabkey}, function () {
            this.fetchQueryData(1);
        })
    }
    getTabSelector() {
        let queryMeta = this.state.queryMeta;
        if (queryMeta == null) return null;
        let options = this.props.options == null ? {} : this.props.options;
        if (options.hiddentab == true) return null;
        if (queryMeta.tab == null || !Object.keys(queryMeta.tab).length) return null;
        let tabSelectors = [];
        let selectedKey = this.state.currentTab;
        for (var key in queryMeta.tab) {
            let itemClassName = selectedKey == key ? "tabitem selected" : "tabitem";
            tabSelectors.push(<span key={key} className={itemClassName} onClick={this._onTabChange.bind(this, key)}>{queryMeta.tab[key]}</span>)
        }
        return <div className="tabselector">{tabSelectors}</div>
    }

    //search逻辑
    getSearchForm() {
        let queryMeta = this.state.queryMeta;
        if (queryMeta == null) return null;
        if (queryMeta.search == null || !Object.keys(queryMeta.search).length) return null;
        return (
            <SearchForm ref="searchform" search={queryMeta.search} onSubmit={this._onpageSearch.bind(this)} />
        )
    }
    _onpageSearch() {
        this.fetchQueryData(1);
    }

    _pageChange(pageNum) {
        this.setState({ pageNum }, this.fetchQueryData)
    }

    //table和分页
    getTable() {
        let { opt } = this.props;
        let { queryData, pageNum, pageSize, totalSize, loadingTable } = this.state;
        if (queryData == null) return null;

        //获取table header.
        let columns = [];
        let cc = []
        for (var i = 0; i < queryData.tableHeaders.length; i++) {
            columns.push({
                ...queryData.tableHeaders[i],
                title: queryData.tableHeaders[i].title,
                dataIndex: queryData.tableHeaders[i].name
            });
        }
        if (opt != null && opt.render != null && opt.render.length > 0) {
            let tmpopt = {};
            tmpopt.title = opt.title == null ? '操作' : opt.title;
            tmpopt.key = 'action';
            tmpopt.render = opt.render;
            tmpopt.width = "100";
            tmpopt.fixed = "right";
            columns.push(tmpopt);
        }
        // console.log(queryData.tableHeaders)
        // console.log(columns)
        //设置数据项
        let data = queryData.rows ? queryData.rows : [];
        // console.log('columns', JSON.stringify(columns))
        // console.log('data', data)
        columns && columns.forEach((item, index) => {
            // console.log('item', item)
            if (item.format) {
                switch (item.format) {
                    case 'amount':
                        data.forEach((i, k) => {
                                // console.log('i', i)
                                // console.log('item.formati',item.format)
                                // let c = _format.formatValue(item, data[k][item.dataIndex])
                                // console.log('c', c)
                                data[k][item.dataIndex] = _format.formatValue(item, data[k][item.dataIndex])
        
                        })
                        break;
                    default:
        
                }
        
            }
            // console.log('处理后data', data)
        })
        return <Table
            pagination={{ current: pageNum, pageSize: pageSize, total: totalSize, onChange: this._pageChange.bind(this), showTotal: (total) => `共 ${total} 条数据`, showQuickJumper: true }}
            loading={this.state.loadingTable}
            columns={columns}
            dataSource={data}
        />
    }

    render() {
        const { queryData, queryMeta, pageSize, totalSize } = this.state
        let filterUI = this.getFilterUI();
        let tabUI = this.getTabSelector();
        let searchUI = this.getSearchForm();
        let tableUI = this.getTable();
        return (
            <div className="app-querytable">
                <div className="tableloading"></div>
                {filterUI}
                {
                    tabUI == null && searchUI == null ? null : (
                        <div className="tabsearchline">
                            {tabUI}
                            {searchUI}
                        </div>
                    )
                }
                <div className="tableui">
                    {tableUI}
                </div>
            </div>
        )
    }
}
