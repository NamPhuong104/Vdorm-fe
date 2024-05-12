import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

const RoomRegister = () => {
  const { status } = useSession();

  return (
    <div className="category-content">
      <h2>Đăng ký phòng</h2>
      <h3>
        Sinh viên đọc kỹ quy trình để tránh xảy ra sai sót trong quá trình đăng
        ký !
      </h3>
      <ol className="room-register-list">
        <li>
          <b>Tìm hiểu thông tin phòng</b>
        </li>
        <p>
          Sinh viên truy cập vào trang web chính thức của ký túc xá Văn Lang để
          tham khảo các loại phòng hiện có, bao gồm giá cả, tiện nghi và chính
          sách liên quan.
        </p>
        <li>
          <b>Chọn hình thức đăng ký</b>
        </li>
        <ol className="a">
          <li>
            <b>Trang Chủ:</b> Sinh viên truy cập vào{' '}
            <Link href={'/'}>Trang Chủ</Link> và bấm vào nút {`"Đăng ký ngay"`}{' '}
            được hiển thị trên đầu trang chủ.
          </li>
          <li>
            <b>Trang Phòng:</b> Sinh viên truy cập vào trang{' '}
            <Link href={'/room-type'}>Phòng</Link> và chọn loại phòng muốn đăng
            ký rồi bấm vào nút {`"Đặt phòng ngay"`}.
          </li>
          <li>
            <b>Trang Đăng Ký:</b> Sinh viên truy cập vào trang{' '}
            {status === 'authenticated' ? (
              <Link href={'/room-register'}>Đăng ký</Link>
            ) : (
              <span
                style={{ cursor: 'pointer', color: '#1677ff' }}
                onClick={() =>
                  signIn('azure-ad', {
                    callbackUrl: '/room-register',
                  })
                }
              >
                Đăng ký
              </span>
            )}{' '}
            và thực hiện điền form đăng ký.
          </li>
        </ol>
        <li>
          <b>Điền thông tin đăng ký</b>
        </li>
        <p>
          Sinh viên sẽ được chuyển đến trang đăng ký phòng và thực hiện điền
          form đăng ký. Thông tin cần bao gồm thông tin cá nhân, thông tin liên
          hệ và các thông tin khác (nếu có). Sinh viên cần đảm bảo rằng thông
          tin được điền đầy đủ và chính xác.
        </p>
        <li>
          <b>Xử lý đăng ký</b>
        </li>
        <p>
          Hệ thống ký túc xá sẽ tiếp nhận thông tin đăng ký từ sinh viên và tiến
          hành xử lý. Quá trình này có thể mất một thời gian để xác nhận và sắp
          xếp phòng cho sinh viên.
        </p>
        <li>
          <b>Phản hồi kết quả</b>
        </li>
        <p>
          Ký túc xá sẽ gửi một phản hồi qua email Outlook cho sinh viên trong
          vòng 2-3 ngày làm việc. Email sẽ thông báo kết quả đăng ký phòng và
          các hướng dẫn tiếp theo.
        </p>
        <li>
          <b>
            Thanh toán và ký hợp đồng (chỉ áp dụng cho sinh viên là chủ phòng)
          </b>
        </li>
        <p>
          Nếu sinh viên hài lòng với kết quả sắp xếp phòng, sinh viên sẽ được
          yêu cầu thanh toán tiền cọc cho ký túc xá và tiến hành các thủ tục cần
          thiết.
        </p>
        <li>
          <b>Lưu ý: Kết quả sắp xếp phòng sẽ bị hủy nếu sinh viên:</b>
        </li>
        <ol className="a">
          <li>Không thanh toán tiền cọc đúng hạn.</li>
          <li>Sinh viên là chủ phòng nhưng không làm hợp đồng nhận phòng.</li>
        </ol>
      </ol>
    </div>
  );
};

export default RoomRegister;
