import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input,message } from 'antd'
import styles from '../../../routes/Manage/Tab/tab.less'
import axios from 'axios'

const FormItem = Form.Item

@Form.create()

class Tab extends Component {

  constructor (props) {
    super(props)
    this.columns = [{
      title: 'id',
      dataIndex: 'id',
      width: '30%',
    }, {
      title: 'title',
      dataIndex: 'title',
    }, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        // console.log('record', record)
        return (
          <Button onClick={() => {this.showModal(record.key)}}>修改</Button>
        )
      },
    }]
    this.state = {
      dataSource: [],
      visible: false,
      tmp: ''
    }
  }

  componentDidMount () {
    axios({
      method: 'GET',
      url: 'http://cloudthink.elatis.cn/config/app/get/news_tab'
    }).then(res=>{
      console.log('suc',res.data.data.tab_list)
      this.setState({
        dataSource: [...res.data.data.tab_list],
      })
      console.log('data',this.state.dataSource)
    })
  }

  showModal = (key) => {
    this.setState({
      visible: true,
      tmp: key
    })
  }

  handleOk = (e) => {
    e.preventDefault()
    console.log('key', this.state.tmp)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          visible: false
        })
        console.log('Received values of form ', values.content)
        this.handleSave(this.state.tmp, values.content)
        this.setState({
          showContent: values.content
        })
        this.props.form.resetFields()
      }
    })
  }

  handleCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleSave = (bc, ac) => {
    const newData = [...this.state.dataSource]
    newData[bc-1].title = ac
    this.setState({
      dataSource: newData
    })

  }

  handleSubmit = () => {
    console.log('data',this.state.dataSource)
    const All = {
      type: "news_tab",
      data: {
        tab_list: [...this.state.dataSource]
      }
    }
    axios({
      method: 'POST',
      headers:{
        "Content-Type": "application/json"
      },
      url:'http://cloudthink.elatis.cn/config/app/update',
      data: JSON.stringify(All)
    }).then( res => {
      console.log('suc',res)
      message.success('提交成功')
    }).catch(err => {
      console.log('err',err)
      message.error('提交失败')
    })
  }

  render () {
    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <Table columns={this.columns} dataSource={this.state.dataSource} pagination={false} />
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请输入您要展示的内容</p>
          <Form>
            <FormItem>
              {getFieldDecorator('content', {
                rules: [{required: true, message: 'Please input your username!'}],
              })(
                <Input placeholder="输入内容" />
              )}
            </FormItem>
          </Form>
        </Modal>
        <div className={styles.submitButton}>
        <Button onClick={this.handleSubmit}>提交</Button>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>
      </div>
    )
  }

}

export default Tab
