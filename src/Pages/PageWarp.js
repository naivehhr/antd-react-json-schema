import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import HeaderSelf from 'Component/Header'
import MySidebar from 'Component/SideBar/MySidebar.js'
import { getSchemaByPath } from './PageSchema';
import { warpComponentBySchema } from './PageComponent';
import { warpPageContainer } from './PageContainer';

class LayoutWarp extends Component {
  render() {
    const {
			location,
      children
    } = this.props;
    return <div className="app-pagecontainer">
             <div className="app-pageheader">
               <HeaderSelf />
             </div>
             <div className="app-pagesiderbar">
               <MySidebar location={location} />
             </div>
             <div className="app-pagecontainer">
               {children}
             </div>
           </div>
  }
}

class CommomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageReady: false,
      pageSchema: null
    }
  }

  componentDidMount() {
    this.fetchPageConfig();
  }

  fetchPageConfig = async () => {
    let { pathname } = this.props.location;
    let config = await getSchemaByPath(pathname);
    this.setState({
      pageReady: true,
      pageSchema: config
    });
  }

  render() {
    if (this.state.pageReady !== true) {
      return <LayoutWarp {...this.props}><div> loading ... </div></LayoutWarp>;
    }
    let pageSchema = this.state.pageSchema;
    if (pageSchema == null) {
      return <LayoutWarp {...this.props}>
        <div> un support component </div>
      </LayoutWarp>;
    }
    if (pageSchema.pageUI != null) {
      let StaticIns = pageSchema.pageUI;
      //判断是否用页面导航layout包含
      if (pageSchema.withoutlayout == true) {
        return <StaticIns {...this.props} />
      }
      return <LayoutWarp {...this.props}>
        <StaticIns {...this.props} />
      </LayoutWarp>
    }
    //走后台逻辑目前默认都用layout包裹起来
    //根据pageschema中的数据来初始化component列表
    let components = this.state.pageSchema.components.map((componentConfig, index) => {
      return warpComponentBySchema(componentConfig, this.props)
    });

    let pageview = warpPageContainer(components, pageSchema.container);
    return <LayoutWarp {...this.props}>
      {pageview}
    </LayoutWarp>;
  }
}

const warpCommonPage = (props) => {
  class DyCommonpage extends Component {
    render() {
      return <CommomPage {...this.props} />
    }
  }
  return <DyCommonpage {...props} />
}

class PageWarp extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    let insertContent = warpCommonPage(this.props);
    return (
      <div>
        {insertContent}
      </div>
    )
  }
}

export default PageWarp;
