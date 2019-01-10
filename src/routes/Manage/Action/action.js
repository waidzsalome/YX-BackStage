import React, { Component } from 'react'
import { Upload, Icon, Button, Form, InputNumber, Input, Popconfirm, Table,message } from 'antd'
import styles from '../../../routes/Manage/Action/action.less'
import getToken from '../getToken'
import axios from 'axios'

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
class Action extends Component {

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      previewVisible: false,
      previewImage: '',
      data: [{
        key: '0',
        start_time: 'start_time',
        end_time: 'end_time',
        title: 'Edward King 0',
        img_url: '',
        cmd: 'London, Park Lane no. 0',
      }, {
        key: '1',
        start_time: 'start_time',
        end_time: 'end_time',
        title: 'Edward King 1',
        img_url: '',
        cmd: 'London, Park Lane no. 1',
      }],
      editingKey: '',
      count: 2,
      num: 2,
      url: null,
      token: 'empty',
    }

    this.columns = [
      {
        title: 'start_time',
        dataIndex: 'start_time',
        width: '15%',
        editable: true,
      },
      {
        title: 'end_time',
        dataIndex: 'end_time',
        width: '15%',
        editable: true,
      },

      {
        title: 'title',
        dataIndex: 'title',
        width: '15%',
        editable: true,
      },
      {
        title: 'Upload',
        dataIndex: 'Upload',
        width: '15%',
        editable: false,
        render: (text, record) => {
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
              }}
            >
              {record.img_url ? <img src={record.img_url} alt="img" style={{width:'100px'}}/> : uploadButton}
            </Upload>
          )
        }
      },
      {
        title: 'cmd',
        dataIndex: 'cmd',
        width: '25%',
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
                        // href="javascript:;"
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
      url: 'http://cloudthink.elatis.cn/config/app/get/home_activity'
    }).then(res=>{
      // console.log('suc',res)
      const length = res.data.data.activity_list.length
      this.setState({
        data: res.data.data.activity_list,
        num: length,
        count:length,
      })
    })
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey
  }

  edit (key) {
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

  handleChange = (recordKey, {file}) => {

    const {response = {}} = file
    const {data} = this.state
    data[recordKey].img_url = QINIU_PATH + '/' + (response.hash || '')
    this.setState({
      data
    })

  }

  handleDelete = (key) => {
    const {num} = this.state
    const dataSource = [...this.state.data]
    this.setState({
      data: dataSource.filter(item => item.key !== key).map((item,index)=>({...item,id:index,key:index})),
      num: num - 1
    })
    // console.log('count', this.state.count)
  }

  getUploadToken = () => {
    const token = getToken()
    // console.log(token)
    this.setState({token})
    // console.log('token', this.state.token)
  }

  handleAdd = () => {
    const {count, data, num} = this.state
    const newData = {
      start_time: 'start_time',
      end_time: 'end_time',
      title: `Edward King ${count}`,
      img_url: '',
      cmd: `London, Park Lane no. ${count}`,
    }
    let tmpData = [...data, newData];
    tmpData = tmpData.map((item, index) => ({...item, key: index.toString(), id: index}))
    this.setState({
      data:tmpData,
      count: count + 1,
      num: num + 1
    })
    // console.log('data', count)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  handleSubmitAll = () => {
    // console.log('img', this.state.data)
    const All = {
      type: 'home_activity',
      data: {
        activity_list: [...this.state.data]
      }
    }
    // console.log('All', JSON.stringify(All))
    axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://cloudthink.elatis.cn/config/app/update',
      data: JSON.stringify(All)
    }).then(res => {
      // console.log('suc', res)
      message.success('提交成功')
    }).catch(err => {
      // console.log('err', err)
      message.error('提交失败')
    })
    // console.log('All',All)
  }

  render () {

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }

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

    // const {getFieldDecorator} = this.props.form

    return (
      <div>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{pageSize: 3}}
        />
        {addButton}
        <div className={styles.submitButton}>
          <Button onClick={this.handleSubmitAll} type="primary">提交信息</Button>
        </div>

      </div>
    )
  }
}

export default Action
