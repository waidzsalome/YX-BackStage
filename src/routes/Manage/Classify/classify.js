import React, { Component } from 'react'
import { Upload, Icon, Modal, Button, Form, InputNumber, Input, Popconfirm, Table,message } from 'antd'
import styles from '../../../routes/Manage/Classify/classify.less'
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

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    id: i + 1,
    icon: `Edrward ${i}`,
    cmd: `London Park no. ${i}`,
  })
}

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
class Classify extends Component {
  constructor (props) {
    super(props)
    this.state = {
      row: 2,
      col: 3,
      picVisible: false,
      previewVisible: false,
      previewImage: '',
      data: [{
        key: '0',
        id: '0',
        name: 'Edward King 0',
        img_url: '',
        cmd: 'London, Park Lane no. 0',
      }, {
        key: '1',
        id: '1',
        name: 'Edward King 1',
        img_url: '',
        cmd: 'London, Park Lane no. 1',
      }],
      editingKey: '',
      count: 2,
      num: 2,
      url: 'waiting',
    }

    this.columns = [
      {
        title: 'id',
        dataIndex: 'id',
        width: '10%',
        editable: false
      },
      {
        title: 'uploadIcon',
        dataIndex: 'uploadIcon',
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
            <div>
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
                {record.img_url ?  <img src={record.img_url} alt="img" style={{width:'100px'}}/> : uploadButton}
              </Upload>
              <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{width: '100%'}} src={this.state.previewImage} />
              </Modal>
            </div>
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
      url: 'http://cloudthink.elatis.cn/config/app/get/home_category'
    }).then(res => {
      // console.log('suc', res)
      const length = res.data.data.category_item.length
      this.setState({
        data: res.data.data.category_item.map((item, index) => ({...item, key: index, id: index})),
        count: length,
        num:length,
      })
      // console.log('newData',this.state.data)
    }).catch(data=>{
      // console.log('fail',data)
    })
  }

  handleChange = (recordKey, {file}) => {
    const {response = {}} = file
    const {data} = this.state
    // console.log('unDefine',data)
    data[recordKey].img_url = QINIU_PATH + '/' + (response.hash || '')
    this.setState({
      data
    })

  }

  handleCancel = () => this.setState({previewVisible: false})

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

  getUploadToken = () => {
    const token = getToken()
    this.setState({token})
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleDelete = (key) => {
    const {num} = this.state
    const dataSource = [...this.state.data]
    this.setState({
      data: dataSource.filter(item => item.key !== key).map((item,index)=>({...item,id:index,key:index})),
      num: num - 1
    })
    // console.log('delete',this.state.data)

  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
        const length= this.state.data.length
        const num=values.row*values.col
        if(length === num)
        {
          const All = {
            type: 'home_category',
            data: {
              row: values.row,
              column: values.col,
              category_item: [...this.state.data],
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
        else{
          message.error('实际分类条数与预期分类条数不相符，请您修改后再次提交')
        }
      }
    })
  }

  onChangeRow = (value) => {
    this.setState({
      row: value
    })
    // console.log('changed', value)
  }

  onChangeCol = (value) => {
    this.setState({
      col: value
    })
  }

  handleAdd = () => {
    const {count, data, num} = this.state
    const newData = {
      name: `Edward King ${count}`,
      img_url: '',
      cmd: `London, Park Lane no. ${count}`,
    }
    let tmpData = [...data, newData];
    tmpData = tmpData.map((item, index) => ({...item, key: index.toString(), id: index.toString()}))
    this.setState({
      data: tmpData,
      count: count + 1,
      num: num + 1
    })
  }

  render () {
    // console.log('render',this.state.data)
    //
    // console.log('renderData',this.state.data)
    const {row, col, num} = this.state
    const {getFieldDecorator} = this.props.form

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }

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

    const addButton = (
      <div className={styles.addButton}>
        <Button onClick={this.handleAdd} type="primary" className={styles.addButton}>
          Add a row
        </Button>
      </div>
    )

    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit} className="login-form">
          <FormItem label="行">
            {getFieldDecorator('row', {initialValue: this.state.row}, {
              rules: [{required: true, message: 'Please input your row!'}],
            })(
              <InputNumber min={1} max={10} onChange={this.onChangeRow} />
            )}
          </FormItem>
          <FormItem label="列">
            {getFieldDecorator('col', {initialValue: this.state.col}, {
              rules: [{required: true, message: 'Please input your col!'}],
            })(
              <InputNumber min={1} max={10} onChange={this.onChangeCol} />
            )}
          </FormItem>
        </Form>
        <br /><br />

        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{pageSize: 4}}
          className={styles.table}
        />
        {row * col > num ? addButton : null}

        <div className={styles.submitButton}>
          <Button onClick={this.handleSubmit} type="primary">提交信息</Button>
        </div>
      </div>
    )
  }

}

export default Classify
