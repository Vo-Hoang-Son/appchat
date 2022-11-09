const transValidation = {
    email_incorrect: "Email phải có dạng name123@gmail.com",
    gender_incorrect: "Vui lòng chọn lại",
    password_incorrect: "Phải chứa ít nhất 8 kí tự bao gồm chữ thường,chữ hoa, số và kí tự đặc biệt ",
    password_confirmation_incorrect: "Nhập lại mật khẩu đã nhập ở trên!",
    update_username: "Tên người dùng giới hạn trong khoảng 3-17 kí tự và không được chứa kí tự đặc biệt.",
    update_gender: "!!!",
    update_address: "Địa chỉ giới hạn trong khoảng 5-30 kí tự.",
    update_phone: "Số điện thoại Việt Nam bắt đầu bằng số 0, từ 10-11 số.",
    keyword_find_user: "Lỗi kí tự tìm kiếm,chỉ cho phép chữ cái và số ,cho phép khoảng trống",
    message_text_emoji_incorrect: "Tin nhắn không hợp lệ.Tối thiểu 1 kí tự",
    add_new_group_users_incorrect: "Vui lòng chọn bạn bè để thêm vào nhóm,tối thiểu 2 người.",
    add_new_group_name_incorrect: "Vui lòng nhập tên nhóm ,từ 5 đến 30 kí tự và không chứa kí tự đặc biệt.",
};

const transErrors = {
    account_in_use: "Email này đã được sử dụng.",
    account_removed: "Tài khoản đã bị xóa khỏi hệ thống",
    account_not_active: "Email này đã được đăng kí nhưng chưa active tài khoản,vui lòng kiểm tra email",
    account_undefined: "Tài khoản không tồn tại",
    token_undifined: "Token không tồn tại",
    login_failed: "Sai mật khẩu hoặc tài khoản!",
    server_error: "Có lỗi ở phía server.Vui lòng liên hệ với bộ phận hỗ trợ.Xin cảm ơn.",
    avatar_type: "Kiểu file hình ảnh không hợp lệ,chỉ chấp nhận định dạng jpg,png,jpeg.",
    avatar_size: "Ảnh upload tối đa cho phép là 1 MB.",
    user_current_password_failed: "Mật khẩu hiện tại không chính xác.",
    coversation_not_found: "Cuộc trò chuyện không tồn tại.",
    image_message_type: "Kiểu file hình ảnh không hợp lệ,chỉ chấp nhận định dạng jpg,png,jpeg.",
    image_message_size: "Ảnh upload tối đa cho phép là 1 MB.",
    attachment_message_size: "Tệp upload tối đa cho phép là 1 MB.",
};

const transSuccess = {
    userCreated: (userEmail) =>{
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo,vui lòng kiểm tra email để active tài khoản trước khi đăng nhập. ` 
    },
    account_activated: "Kích hoạt tài khoản thành công ,bạn đã có thể đăng nhập vào ứng dụng.",
    login_success: (username) =>{
        return `Xin chào ${username}.Chúc các bạn một ngày tốt lành.`;
    },
    logout_success: "Đăng xuất tài khoản thành công.",
    user_Info_updated: "Cập nhật thông tin người dùng thành công.",
    user_password_updated: "Cập nhật mật khẩu thành công."
};

const transMail = {
    subject: "Awesome chat: Xác nhận kích hoạt tài khoản.",
    template: (linkVerify) =>{
        return `
            <h2>Bạn nhận được email này vì đã dăng ký tài khoản trên ứng dụng Awssome chat.</h2>
            <h3>Vui lòng click vào link bên dưới để xác nhận tài khoản.</h3>
            <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
            <h4>Nếu thấy email này là nhầm lẫn,hãy bỏ qua nó.</h4>
        `;
    },
    send_fail: "Có lỗi trong quá trình gửi email,vui lòng liên hệ với bộ phận hỗ trợ."
};

module.exports = {transValidation, transErrors, transSuccess, transMail};
