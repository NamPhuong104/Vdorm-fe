'use client';

import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FileExcelOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  PlusOutlined,
  QrcodeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Col, Flex, Row, Space, Upload } from 'antd';
import Link from 'next/link';
import Access from './Access';

interface IProps {
  moduleName: string;
  handleAddNew?: () => void;
  addNewPermission?: { method: string; apiPath: string; module: string };
  handleBeforeUpload?: (file: any) => boolean;
  handleUploadFile?: ({ file, onSuccess, onError }: any) => void;
  importPermission?: { method: string; apiPath: string; module: string };
  exportLink?: any;
  exportPermission?: { method: string; apiPath: string; module: string };
  handleDelete?: () => void;
  deletePermission?: { method: string; apiPath: string; module: string };
  handleSendEmail?: () => void;
  sendEmailPermission?: { method: string; apiPath: string; module: string };
  handleUpdateManyRegistration?: () => void;
  updateManyRegistrationPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  isDisableArrageAuto?: boolean;
  handleArrangeAuto?: () => void;
  arrangeAutoPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleCheckIn?: () => void;
  checkInPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleCheckOut?: () => void;
  checkOutPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleExportInOut?: () => void;
  exportInOutPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  qrCodeLink?: string;
  isDisableExportStatistic?: boolean;
  exportStatisticLink?: string;
  permissionList?: IPermission[];
}

const AppTitle = (props: IProps) => {
  const {
    moduleName,
    handleAddNew,
    addNewPermission,
    handleBeforeUpload,
    handleUploadFile,
    importPermission,
    exportLink,
    exportPermission,
    handleDelete,
    deletePermission,
    handleSendEmail,
    sendEmailPermission,
    handleUpdateManyRegistration,
    updateManyRegistrationPermission,
    isDisableArrageAuto,
    handleArrangeAuto,
    arrangeAutoPermission,
    handleCheckIn,
    checkInPermission,
    handleCheckOut,
    checkOutPermission,
    handleExportInOut,
    exportInOutPermission,
    qrCodeLink,
    isDisableExportStatistic,
    exportStatisticLink,
    permissionList,
  } = props;

  return (
    <div className="app-title-component">
      <Row
        gutter={[4, 10]}
        justify={'space-between'}
        align={'top'}
        style={{ margin: '0%', paddingBottom: '7px' }}
      >
        <Col xs={24} sm={24} md={20} lg={20} xl={21} xxl={22}>
          <Flex className="title">
            <h2
              style={{
                fontSize: '25px',
                fontWeight: '700',
              }}
            >
              {moduleName}
            </h2>
          </Flex>
        </Col>
        <Col xs={24} sm={24} md={4} lg={4} xl={3} xxl={2}>
          <Flex style={{ flexDirection: 'row-reverse' }}>
            <Space>
              {exportLink ? (
                <Access
                  hideChildren
                  permission={exportPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="export-btn"
                    type="primary"
                    size={'middle'}
                    onClick={() => (window.location.href = exportLink)}
                    style={{
                      padding: '4px 18px',
                      fontWeight: '700',
                      background: 'purple',
                      borderColor: 'purple',
                      color: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                  >
                    TẢI FILE MẪU
                    <ExportOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleBeforeUpload && handleUploadFile ? (
                <Access
                  hideChildren
                  permission={importPermission}
                  permissionList={permissionList}
                >
                  <Upload
                    listType="text"
                    accept=".xlsx"
                    maxCount={1}
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={handleBeforeUpload}
                    customRequest={handleUploadFile}
                  >
                    <Button
                      className="import-btn"
                      type="primary"
                      size={'middle'}
                      style={{
                        padding: '4px 18px',
                        fontWeight: '700',
                        background: 'grey',
                        borderColor: 'grey',
                        color: 'white',
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                      }}
                    >
                      NHẬP FILE
                      <FileExcelOutlined />
                    </Button>
                  </Upload>
                </Access>
              ) : (
                <></>
              )}
              {handleSendEmail ? (
                <Access
                  hideChildren
                  permission={sendEmailPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="send-email-btn"
                    type="primary"
                    size={'middle'}
                    style={{
                      padding: '4px 18px',
                      fontWeight: '700',
                      background: 'grey',
                      borderColor: 'grey',
                      color: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    onClick={handleSendEmail}
                  >
                    GỬI EMAIL <MailOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleArrangeAuto ? (
                <Access
                  hideChildren
                  permission={arrangeAutoPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="arrange-auto-btn"
                    type="primary"
                    size={'middle'}
                    style={{ fontWeight: '700' }}
                    onClick={handleArrangeAuto}
                    disabled={isDisableArrageAuto ?? false}
                  >
                    SẮP XẾP <SettingOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleUpdateManyRegistration ? (
                <Access
                  hideChildren
                  permission={updateManyRegistrationPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="update-many-registration-btn"
                    type="link"
                    size={'middle'}
                    style={{
                      padding: '4px 16px',
                      fontWeight: '700',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    onClick={handleUpdateManyRegistration}
                  >
                    CẬP NHẬT <EditOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleDelete ? (
                <Access
                  hideChildren
                  permission={deletePermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="delete-btn"
                    type="primary"
                    size={'middle'}
                    style={{
                      padding: '4px 18px',
                      fontWeight: '700',
                      background: 'red',
                      borderColor: 'red',
                      color: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    onClick={handleDelete}
                  >
                    XÓA <DeleteOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleCheckOut ? (
                <Access
                  hideChildren
                  permission={checkOutPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="check-out-btn"
                    type="primary"
                    size={'middle'}
                    style={{
                      padding: '4px 16px',
                      fontWeight: '700',
                      background: 'red',
                      borderColor: 'red',
                      color: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    onClick={handleCheckOut}
                  >
                    CHECK OUT <LogoutOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleCheckIn ? (
                <Access
                  hideChildren
                  permission={checkInPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="check-in-btn"
                    type="primary"
                    size={'middle'}
                    style={{
                      padding: '4px 16px',
                      fontWeight: '700',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    onClick={handleCheckIn}
                  >
                    CHECK IN <LoginOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleExportInOut ? (
                <Access
                  hideChildren
                  permission={exportInOutPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="export-in-out-btn"
                    type="link"
                    size={'middle'}
                    style={{
                      padding: '4px 16px',
                      fontWeight: '700',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    onClick={handleExportInOut}
                  >
                    XUẤT FILE <ExportOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {qrCodeLink ? (
                <Link href={qrCodeLink} target="_blank">
                  <Button
                    className="qr-code-btn"
                    type="primary"
                    size={'middle'}
                    style={{ fontWeight: '700' }}
                  >
                    QR CODE <QrcodeOutlined />
                  </Button>
                </Link>
              ) : (
                <></>
              )}
              {exportStatisticLink ? (
                <Access
                  hideChildren
                  permission={exportPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="export-statistic-btn"
                    type="primary"
                    size={'middle'}
                    onClick={() => (window.location.href = exportStatisticLink)}
                    style={{
                      padding: '4px 15px',
                      fontWeight: '700',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    disabled={isDisableExportStatistic ?? false}
                  >
                    XUẤT FILE
                    <ExportOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
              {handleAddNew ? (
                <Access
                  hideChildren
                  permission={addNewPermission}
                  permissionList={permissionList}
                >
                  <Button
                    className="add-new-btn"
                    type="primary"
                    size={'middle'}
                    onClick={handleAddNew}
                  >
                    THÊM MỚI <PlusOutlined />
                  </Button>
                </Access>
              ) : (
                <></>
              )}
            </Space>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default AppTitle;
