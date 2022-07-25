import HandleApi from "../api/HandleAPI";

const getAccountsParents = async () => {
    return await HandleApi.APIGetWithToken("admin/parents");
};

const getAccountsAdmin = async () => {
    return await HandleApi.APIGetWithToken("admin");
};

const getAccountsTeacher = async () => {
    return await HandleApi.APIGetWithToken("admin/teachers");
};

const getFreeTeacher = async () => {
    return await HandleApi.APIGetWithToken("admin/teachers/get-teacher/");
};

// const getAccountById = async (id) => {
//   return await HandleApi.APIGetWithToken(`accounts/${id}`)
// }

const deleteAccountParentsById = async (id) => {
    return await HandleApi.APIDelete(`admin/parents/${id}`);
};

const deleteAccountAdminById = async (id) => {
    return await HandleApi.APIDelete(`admin/${id}`);
};

const deleteAccountTeacherById = async (id) => {
    return await HandleApi.APIDelete(`admin/teachers/${id}`);
};

const addAccountAdmin = async (params) => {
    return await HandleApi.APIPostWithToken(`admin`, params);
};

const addAccountParents = async (params) => {
    return await HandleApi.APIPostWithTokenIMG(`admin/parents`, params);
};

const addAccountTeacher = async (params) => {
    return await HandleApi.APIPostWithTokenIMG(`admin/teachers`, params);
};

// const updateProfile = async (params) => {
//   return await HandleApi.APIPutWithToken("accounts", params)
// }

const AccountService = {
    getAccountsParents,
    getAccountsAdmin,
    getAccountsTeacher,
    //  getAccountById,
    //   updateProfile,
    deleteAccountParentsById,
    deleteAccountAdminById,
    deleteAccountTeacherById,
    addAccountAdmin,
    addAccountParents,
    addAccountTeacher,
    getFreeTeacher,
};

export default AccountService;
