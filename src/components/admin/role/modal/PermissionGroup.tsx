'use client';

import {
  Card,
  Col,
  Collapse,
  Form,
  FormInstance,
  Row,
  Switch,
  Typography,
} from 'antd';
import { CollapseProps } from 'antd/lib';
import { useEffect, useState } from 'react';

interface IProps {
  form: FormInstance;
  permissionListGroupByModule:
    | {
        module: string;
        permissionList: IPermission[];
      }[]
    | null;
}

const PermissionGroup = (props: IProps) => {
  const { form, permissionListGroupByModule } = props;
  const [collapseItems, setCollapseItems] = useState<CollapseProps['items']>(
    [],
  );

  const handleSwitchAll = (value: boolean, name: string) => {
    const modules = permissionListGroupByModule?.find(
      (item) => item.module === name,
    );

    if (modules) {
      modules?.permissionList?.forEach((permission: any) => {
        if (permission._id) {
          form.setFieldValue(['permissionList', permission._id], value);
        }
      });
    }
  };

  const handleSingleCheck = (value: boolean, child: string, parent: string) => {
    form.setFieldValue(['permissionList', child], value);

    const temp = permissionListGroupByModule?.find(
      (item) => item.module === parent,
    );

    if (temp) {
      const restPermission = temp?.permissionList?.filter(
        (permission) => permission._id !== child,
      );

      if (restPermission && restPermission.length) {
        const allTrue = restPermission.every((permission) =>
          form.getFieldValue(['permissionList', permission._id as string]),
        );
        form.setFieldValue(['permissionList', parent], allTrue && value);
      }
    }
  };

  const genExtra = (module: string) => (
    <div className="form-switch-item">
      <Form.Item name={['permissionList', module]} valuePropName="checked">
        <Switch
          onChange={(value) => handleSwitchAll(value, module)}
          onClick={(checked, event) => event.stopPropagation()}
        />
      </Form.Item>
    </div>
  );

  useEffect(() => {
    const collapseItemsClone: CollapseProps['items'] = [];

    if (permissionListGroupByModule) {
      permissionListGroupByModule?.map((item, index) => {
        collapseItemsClone.push({
          key: index,
          label: item.module,
          children: (
            <Row gutter={[16, 16]}>
              {item.permissionList?.map((value, i: number) => (
                <Col key={i} xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Card
                    size="small"
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px',
                      }}
                    >
                      <p>{value.name}</p>
                      <div className="form-switch-item">
                        <Form.Item
                          name={['permissionList', value._id as string]}
                          valuePropName="checked"
                        >
                          <Switch
                            onChange={(v) =>
                              handleSingleCheck(
                                v,
                                value._id as string,
                                item.module,
                              )
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Typography.Text
                        ellipsis
                        style={{
                          fontWeight: 'bold',
                          color:
                            value.method === 'GET'
                              ? 'green'
                              : value.method === 'POST'
                              ? '#ffd900'
                              : value.method === 'PATCH'
                              ? 'purple'
                              : 'red',
                        }}
                      >
                        {value.method}
                      </Typography.Text>
                      <Typography.Text ellipsis>
                        {value.apiPath}
                      </Typography.Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ),
          extra: genExtra(item.module),
          showArrow: false,
        });
      });
    }

    setCollapseItems(collapseItemsClone);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionListGroupByModule]);

  if (!permissionListGroupByModule) return <></>;

  return (
    <Collapse
      items={collapseItems}
      activeKey={Array.from(Array(permissionListGroupByModule.length).keys())}
    ></Collapse>
  );
};

export default PermissionGroup;
