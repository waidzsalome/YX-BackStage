import React, { Component }  from 'react'
import { Route } from 'react-router-dom'
import styles from './SecondRouter.less'
import { Layout } from 'antd'
import Action from '../../routes/Manage/Action/action'
import Carousel from '../../routes/Manage/Carousel/carousel'
import Classify from '../../routes/Manage/Classify/classify'
import Tab from '../../routes/Manage/Tab/tab'

const { Content } = Layout;
export default class  SecondRouter extends Component {
  render(){
    return (
      <Content className={styles.content}>
        <Route path="/manage/carousel" component={Carousel} />
        <Route path="/manage/action" component={Action} />
        <Route path="/manage/classify" component={Classify} />
        <Route path="/manage/tab" component={Tab} />

      </Content>
    );
  }
}
