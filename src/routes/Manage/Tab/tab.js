import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input } from 'antd'

const FormItem = Form.Item

@Form.create()

class Tab extends Component {

  constructor (props) {
    super(props)
    this.columns = [{
      title: 'TabId',
      dataIndex: 'TabId',
      width: '30%',
    }, {
      title: 'age',
      dataIndex: 'age',
    }, {
      title: 'TabContent',
      dataIndex: 'TabContent',
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
      dataSource: [{
        key: '1',
        TabId: 'John Brown',
        age: 32,
        TabContent: 'New York No. 1 Lake Park',
      }, {
        key: '2',
        TabId: 'Jim Green',
        age: 42,
        TabContent: 'London No. 1 Lake Park',
      }, {
        key: '3',
        TabId: 'Joe Black',
        age: 32,
        TabContent: 'Sidney No. 1 Lake Park',
      }],
      visible: false,
      tmp: ''
    }
  }

  showModal = (key) => {
    this.setState({
      visible: true,
      tmp: key
    })
    console.log('eeee', this.state.dataSource[0])
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
    // console.log('data', bc, ac)
    // console.log('data',newData[bc-1].TabContent)
    // console.log('item', item, typeof (item))
    newData[bc-1].TabContent = ac
    // console.log('res',newData)
    this.setState({
      dataSource: newData
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
        <Button>提交</Button>
      </div>
    )
  }

}

export default Tab
