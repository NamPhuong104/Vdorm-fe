import Access from '@/components/admin/global/Access';
import {
  faBan,
  faCheck,
  faEye,
  faGear,
  faLightbulb,
  faPenToSquare,
  faPrint,
  faQrcode,
  faSignature,
  faTrashCan,
  faUserMinus,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popconfirm, Space, Tooltip } from 'antd';

interface IProps {
  record?: any;
  handleViewModal?: () => void;
  viewModalPermission?: { method: string; apiPath: string; module: string };
  handleEditModal?: () => void;
  editModalPermission?: { method: string; apiPath: string; module: string };
  handleDeleteRecord?: () => void;
  deleteRecordPermission?: { method: string; apiPath: string; module: string };
  handleUpdateStudentList?: () => void;
  updateStudentListPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleExportRecord?: () => void;
  exportRecordPermission?: { method: string; apiPath: string; module: string };
  handleQRCode?: () => void;
  qrCodePermission?: { method: string; apiPath: string; module: string };
  handleSignContract?: () => void;
  signContractPermission?: { method: string; apiPath: string; module: string };
  handleTerminateContract?: () => void;
  terminateContractPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleElectricRecording?: () => void;
  electricRecordingPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleUpdateStatus?: () => void;
  updateStatusPermission?: { method: string; apiPath: string; module: string };
  handleProcessingRegistration?: () => void;
  processingRegistrationPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleProcessedRegistration?: () => void;
  processedRegistrationPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleOutOfRoom?: () => void;
  outOfRoomPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  handleReturnRoom?: () => void;
  returnRoomPermission?: {
    method: string;
    apiPath: string;
    module: string;
  };
  permissionList: IPermission[];
}

const ActionButtons = (props: IProps) => {
  const {
    record,
    handleViewModal,
    viewModalPermission,
    handleEditModal,
    editModalPermission,
    handleDeleteRecord,
    deleteRecordPermission,
    handleUpdateStudentList,
    updateStudentListPermission,
    handleExportRecord,
    exportRecordPermission,
    handleQRCode,
    qrCodePermission,
    handleSignContract,
    signContractPermission,
    handleTerminateContract,
    terminateContractPermission,
    handleElectricRecording,
    electricRecordingPermission,
    handleUpdateStatus,
    updateStatusPermission,
    handleProcessingRegistration,
    processingRegistrationPermission,
    handleProcessedRegistration,
    processedRegistrationPermission,
    handleOutOfRoom,
    outOfRoomPermission,
    handleReturnRoom,
    returnRoomPermission,
    permissionList,
  } = props;

  return (
    <Space size={'middle'} wrap={false}>
      {handleQRCode ? (
        <Access
          hideChildren
          permission={qrCodePermission}
          permissionList={permissionList}
        >
          <Tooltip title="QR Code" placement="bottom">
            <Button
              className="action-buttons"
              type="default"
              size={'small'}
              style={{
                background: 'transparent',
                borderColor: 'transparent',
                color: '#2e0969',
              }}
              icon={<FontAwesomeIcon icon={faQrcode} />}
              onClick={handleQRCode}
            />
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleViewModal ? (
        <Access
          hideChildren
          permission={viewModalPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Xem" placement="bottom">
            <Button
              className="action-buttons"
              type="default"
              size={'small'}
              style={{
                background: 'transparent',
                borderColor: 'transparent',
                color: '#448026',
              }}
              icon={<FontAwesomeIcon icon={faEye} />}
              onClick={handleViewModal}
            />
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleExportRecord ? (
        <Access
          hideChildren
          permission={exportRecordPermission}
          permissionList={permissionList}
        >
          <Tooltip title="In hợp đồng" placement="bottom">
            <Button
              className="action-buttons"
              type="default"
              size={'small'}
              style={{
                background: 'transparent',
                borderColor: 'transparent',
                color: '#0d7bba',
              }}
              icon={<FontAwesomeIcon icon={faPrint} />}
              onClick={handleExportRecord}
            />
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleEditModal ? (
        <Access
          hideChildren
          permission={editModalPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Cập nhật" placement={'bottom'}>
            <Button
              className="action-buttons"
              type="default"
              size={'small'}
              style={{
                background: 'transparent',
                borderColor: 'transparent',
                color: '#e3ba5b',
              }}
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
              onClick={handleEditModal}
            />
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleUpdateStudentList ? (
        <Access
          hideChildren
          permission={updateStudentListPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Cập nhật sinh viên" placement="bottom">
            <Button
              className="action-buttons"
              type="default"
              size={'small'}
              style={{
                background: 'transparent',
                borderColor: 'transparent',
                color: '#5BB3E3',
              }}
              icon={<FontAwesomeIcon icon={faUserPlus} />}
              onClick={handleUpdateStudentList}
            />
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleSignContract ? (
        <Access
          hideChildren
          permission={signContractPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Đã ký" placement="bottom">
            <Popconfirm
              title="Chuyển trạng thái thành 'Đã ký' ?"
              onConfirm={handleSignContract}
              okText="Đồng ý"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#ff8a0d',
                }}
                icon={<FontAwesomeIcon icon={faSignature} />}
              />
            </Popconfirm>
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleTerminateContract ? (
        <Access
          hideChildren
          permission={terminateContractPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Chấm dứt" placement="bottom">
            <Popconfirm
              title="Chuyển trạng thái thành 'Chấm dứt' ?"
              onConfirm={handleTerminateContract}
              okText="Đồng ý"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#ff0d0d',
                }}
                icon={<FontAwesomeIcon icon={faBan} />}
              />
            </Popconfirm>
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleElectricRecording ? (
        <Access
          hideChildren
          permission={electricRecordingPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Ghi điện" placement="bottom">
            <Button
              className="action-buttons"
              type="default"
              size={'small'}
              style={{
                background: 'transparent',
                borderColor: 'transparent',
                color: '#e3ba5b',
              }}
              icon={<FontAwesomeIcon icon={faLightbulb} />}
              onClick={handleElectricRecording}
            />
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleUpdateStatus ? (
        <Access
          hideChildren
          permission={updateStatusPermission}
          permissionList={permissionList}
        >
          <Popconfirm
            title="Bạn có chắc chắn muốn chuyển trạng thái ?"
            onConfirm={handleUpdateStatus}
            okText="Đồng ý"
            cancelText="Hủy"
            placement="left"
          >
            <Tooltip title="Chuyển trạng thái" placement="bottom">
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: 'red',
                }}
                icon={<FontAwesomeIcon icon={faCheck} />}
              />
            </Tooltip>
          </Popconfirm>
        </Access>
      ) : (
        <></>
      )}
      {handleProcessingRegistration ? (
        <Access
          hideChildren
          permission={processingRegistrationPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Đang xử lý" placement="bottom">
            <Popconfirm
              title="Chuyển trạng thái thành 'Đang xử lý' ?"
              onConfirm={handleProcessingRegistration}
              okText="Đồng ý"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#ff8a0d',
                }}
                icon={<FontAwesomeIcon icon={faGear} />}
              />
            </Popconfirm>
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleProcessedRegistration ? (
        <Access
          hideChildren
          permission={processedRegistrationPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Đã xử lý" placement="bottom">
            <Popconfirm
              title="Chuyển trạng thái thành 'Đã xử lý' ?"
              onConfirm={handleProcessedRegistration}
              okText="Đồng ý"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#5BB3E3',
                }}
                icon={<FontAwesomeIcon icon={faCheck} />}
              />
            </Popconfirm>
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleOutOfRoom ? (
        <Access
          hideChildren
          permission={outOfRoomPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Hết phòng" placement="bottom">
            <Popconfirm
              title="Chuyển trạng thái thành 'Hết phòng' ?"
              onConfirm={handleOutOfRoom}
              okText="Đồng ý"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#ff0d0d',
                }}
                icon={<FontAwesomeIcon icon={faBan} />}
              />
            </Popconfirm>
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleReturnRoom ? (
        <Access
          hideChildren
          permission={returnRoomPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Ngừng ở" placement="bottom">
            <Popconfirm
              title="Chuyển trạng thái thành 'Ngừng ở' ?"
              onConfirm={handleReturnRoom}
              okText="Đồng ý"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: '#ff0d0d',
                }}
                icon={<FontAwesomeIcon icon={faUserMinus} />}
              />
            </Popconfirm>
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
      {handleDeleteRecord ? (
        <Access
          hideChildren
          permission={deleteRecordPermission}
          permissionList={permissionList}
        >
          <Tooltip title="Xóa" placement="bottom">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa ?"
              onConfirm={handleDeleteRecord}
              okText="Đồng ý"
              cancelText="Hủy"
              placement="left"
            >
              <Button
                className="action-buttons"
                type="default"
                size={'small'}
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  color: 'red',
                }}
                icon={<FontAwesomeIcon icon={faTrashCan} />}
              />
            </Popconfirm>
          </Tooltip>
        </Access>
      ) : (
        <></>
      )}
    </Space>
  );
};

export default ActionButtons;
