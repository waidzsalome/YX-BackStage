import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import Content from './SecondRouter'
import styles from '../../routes/Manage/Manage.less'

const {Header, Sider, Footer} = Layout

class Manage extends Component {

  state = {
    collapsed: false
  }

  onCollapse = (collapsed) => {
    console.log(collapsed)
    this.setState({
      collapsed
    })
  }

  render () {
    return (
      <Layout className={styles.ContainAll}>
        <Sider
          // breakpoint="lg"
          // collapsedWidth="0"
          // onBreakpoint={(broken) => { console.log(broken); }}
          // onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className={styles.logo}>

            {this.state.collapsed ? <Icon type="smile" /> : <span>云想后台管理系统</span>}
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>

            <Menu.Item key="1">
              <Link to='/manage/carousel'>
                <Icon type="picture" />
                <span className="nav-text">轮播图信息</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="2">
              <Link to='/manage/classify'>
                <Icon type="bars" />
                <span className="nav-text">分类信息</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="3">
              <Link to='/manage/action'>
                <Icon type="upload" />
                <span className="nav-text">活动信息</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="4">
              <Link to='/manage/tab'>
                <Icon type="user" />
                <span className="nav-text">底部信息栏</span>
              </Link>
            </Menu.Item>

          </Menu>

        </Sider>

        <Layout>
          <Header style={{background: '#fff', padding: 0}} />

          <Content />

          <Footer style={{textAlign: 'center'}}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>

      </Layout>
    )
  }
}

export default Manage
