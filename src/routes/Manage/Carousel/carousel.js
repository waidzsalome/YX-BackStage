import React, { Component } from 'react'
import axios from 'axios'
import { Upload, Icon, Modal, Button, Form, InputNumber, Input, Popconfirm, Table ,message} from 'antd'
import styles from '../../../routes/Manage/Carousel/carousel.less'
import getToken from '../getToken'

const QINIU_SERVER = 'http://upload-z1.qiniup.com'
const QINIU_PATH = 'http://qiniu.waidzsalome.cn'
const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

@Form.create()

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />
    }
    return <Input />
  }

  render () {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props
    return (
      <EditableContext.Consumer>
        {(form) => {
          const {getFieldDecorator} = form
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{margin: 0}}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          )
        }}
      </EditableContext.Consumer>
    )
  }
}

@Form.create()
class Carousel extends Component {

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      previewVisible: false,
      previewImage: '',
      data: [{
        key: '0',
        title: 'Edward King 0',
        img_url: '',
        cmd: 'London, Park Lane no. 0',
      }, {
        key: '1',
        title: 'Edward King 1',
        img_url: '',

        cmd: 'London, Park Lane no. 1',
      }],
      editingKey: '',
      count: 2,
      num: 2,
      time: 3000,
      url: 'waiting',
      token: ''
    }

    this.columns = [
      {
        title: 'title',
        dataIndex: 'title',
        width: '20%',
        editable: true,
      },
      {
        title: 'upload',
        dataIndex: 'upload',
        width: '25%',
        editable: false,
        render: (text, record) => {
          // console.log('recordCmp', record.img_url)
          // console.log('recordKey', record.key)
          const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          )
          return (
            <Upload
              action={QINIU_SERVER}
              data={{token: this.state.token}}
              showUploadList={false}
              listType="picture-card"
              beforeUpload={this.getUploadToken}
              onPreview={this.handlePreview}
              onChange={this.handleChange.bind(this, record.key)}
              onRemove={(file) => {
                const {response = {}} = file
                response.hash = ''
                // console.log('test', response.hash)
              }}
            >
              {record.img_url ? <img src={record.img_url} alt="img" style={{width: '100px'}} /> : uploadButton}
              {/*没有hash值的时候显示按钮*/}
            </Upload>
          )
        }
      },
      {
        title: 'cmd',
        dataIndex: 'cmd',
        width: '35%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record)
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() => this.save(form, record.key)}
                        style={{marginRight: 8}}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.key)}>Edit</a>
              )}
              &nbsp;&nbsp;&nbsp;&nbsp;
              {this.state.data.length >= 1
                ? (
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                    <a>Delete</a>
                  </Popconfirm>
                ) : null
              }
            </div>
          )
        },
      },
    ]
  }

  componentDidMount () {

    axios({
      method: 'GET',
      url: 'http://cloudthink.elatis.cn/config/app/get/home_banner'
    }).then(res => {
      // console.log('suc', res.data.data)
      const length = res.data.data.banner_list.length
      // console.log('l', length)
      this.setState({
        data: res.data.data.banner_list.map((item, index) => ({...item, key: index, id: index})),
        count: length,
        num: length,
      })
      // console.log('newData',this.state.data)
    }).catch(data => {
      // console.log('fail')
    })

  }

  isEditing = (record) => {
    return record.key === this.state.editingKey
  }

  edit (key) {
    // console.log('edit', key)
    this.setState({editingKey: key})
  }

  save (form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      const newData = [...this.state.data]
      const index = newData.findIndex(item => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        this.setState({data: newData, editingKey: ''})
      } else {
        newData.push(row)
        this.setState({data: newData, editingKey: ''})
      }
    })
  }

  cancel = () => {
    this.setState({editingKey: ''})
  }

  getUploadToken = () => {
    const token = getToken()
    // console.log(token)
    this.setState({token})
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = (recordKey, {file}) => {
    // const {response = {}} = file
    // const {data} = this.state
    // let tmpData = data.filter(item => item.key === recordKey)[0] || {}
    // tmpData.img_url = QINIU_PATH + '/' + (response.hash || '')
    // this.setState({
    //   data: [...data.filter(item => item.key !== recordKey), {...tmpData}]
    // })
    // console.log('change', this.state.data)

    const {response = {}} = file
    const {data} = this.state
    data[recordKey].img_url = QINIU_PATH + '/' + (response.hash || '')
    this.setState({
      data
    })
    // console.log('url', data[recordKey].img_url)
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e) => {
    // console.log(e)
    // console.log('OK')
    this.setState({
      visible: false,
    })
    this.handleSubmit(e)
  }

  handleMCancel = (e) => {
    // console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleDelete = (key) => {
    const {num} = this.state
    const dataSource = [...this.state.data]

    this.setState({
      data: dataSource.filter(item => item.key !== key).map((item,index)=>({...item,id:index,key:index})),
      num: num - 1,
    })

    // console.log('count', this.state.count)
  }

  handleAdd = () => {
    const {count, data, num} = this.state
    const newData = {
      title: `Edward King ${count}`,
      img_url: '',
      cmd: `London, Park Lane no. ${count}`,
    }
    let tmpData = [...data, newData]
    tmpData = tmpData.map((item, index) => ({...item, key: index.toString(), id: index.toString()}))
    this.setState({
      data: tmpData,
      count: count + 1,
      num: num + 1
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          time: values.time
        })
        // console.log('Received values of form: ', values.time)
      }
    })
  }

  handleSubmitAll = () => {
    // console.log('img', this.state.data)
    // console.log('time&type', this.state.time, '--', this.state.num)
    const All = {
      type: 'home_banner',
      data: {
        type: 1,
        internal: this.state.time,
        banner_list: [...this.state.data]
      }
    }
    axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://cloudthink.elatis.cn/config/app/update',
      data: JSON.stringify(All)
    }).then(res => {
      message.success('提交成功')
      // console.log('suc', res)
    }).catch(err => {
      // console.log('err', err)
      message.error('提交失败')
    })
  }

  render () {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }
    const {previewVisible, previewImage} = this.state

    const addButton = (
      <div className={styles.addButton}>
        <Button onClick={this.handleAdd} type="primary" className={styles.addButton}>
          Add a row
        </Button>
      </div>
    )

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      }
    })

    const {getFieldDecorator} = this.props.form

    return (
      <div className="clearfix">
        <div className={styles.settings}>
          <Button type="primary" onClick={this.showModal}>
            <Icon type="setting" />
          </Button>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleMCancel}
          >
            <Form>
              <FormItem
                label="请输入轮播时间"
                labelCol={{span: 7}}
                wrapperCol={{span: 12}}
              >
                {getFieldDecorator('time', {
                  rules: [{required: true, message: 'Please input your time!'}],
                })(
                  <InputNumber placeholder={this.state.time} />
                )}
              </FormItem>
              <FormItem
                wrapperCol={{span: 12, offset: 5}}
              >
              </FormItem>
            </Form>

          </Modal>
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage} />
        </Modal>
        <br />
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{pageSize: 3}}
        />

        {this.state.num >= 5 ? null : addButton}
        <div className={styles.submitButton}>
          <Button onClick={this.handleSubmitAll} type="primary">
            提交信息
          </Button>
        </div>
      </div>
    )
  }
}

export default Carousel
