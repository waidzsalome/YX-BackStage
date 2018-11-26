import { Button } from 'antd'
const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',
},{
  title: 'Action',
  ket: 'action',
  render: () => (
    <span>
      <Button>修改</Button>
    </span>
  ),
}];

export default columns
