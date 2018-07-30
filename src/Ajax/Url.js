const SERVER_URL = {
    USER_LOGIN: '/scmserver/enterprise-web-oapi/platform/user/login',
    USER_LOGIN_BYVCODE: '/scmserver/enterprise-web-oapi/platform/user/loginByVerifyCode',
    USER_LOGOUT: '/scmserver/enterprise-web-oapi/platform/user/logout',
    USER_INFO: '/scmserver/enterprise-web-oapi/platform/user/userinfo',

    VERIFY_CODE: '/scmserver/enterprise-web-oapi/platform/verifyCode/send',
    VERIFY_CODE_BEFORELOGIN: '/scmserver/enterprise-web-oapi/platform/verifyCode/sendBeforeLogin',
    IMAGE_PREVIEW: '/enterprise-web-oapi/platform/image/preview/',
    FILE_UPLOAD: '/enterprise-web-oapi/platform/file/upload',
    
}
export default SERVER_URL;