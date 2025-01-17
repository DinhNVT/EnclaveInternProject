import HandleApi from "../api/HandleAPI";

const getSubjects = async () => {
    return await HandleApi.APIGetWithToken("subjects");
};

const getGrades = async () => {
    return await HandleApi.APIGetWithToken("grades");
};

const deleteSubjectsById = async (id) => {
    return await HandleApi.APIDelete(`subjects/${id}`);
};

const getSubjectsByGradeId = async (id) => {
    return await HandleApi.APIGetWithToken(`subjects/${id}`);
};

const addSubject = async (id, params) => {
    return await HandleApi.APIPostWithToken(
        `subjects/create-subject/${id}`,
        params
    );
};

const getSubjectById = async (id) => {
    return await HandleApi.APIGetWithToken(`subjects/get-subject-by-id/${id}`);
};

const updateSubject = async (id, params) => {
    return await HandleApi.APIPutWithToken(`subjects/${id}`, params);
};

const getStudentBySubject = async (id) => {
    return await HandleApi.APIGetWithToken(
        `subjects/get-student-by-subject-id/${id}`
    );
};

const addSubjectToStudent = async (subjectID, studentID) => {
    return await HandleApi.APIGetWithToken(
        `teacher/subjects/add-subjects-to-student/${subjectID}&${studentID}`
    );
};
const getSubjectByStudentId = async (id) => {
    return await HandleApi.APIGetWithToken(
        `subjects/get-subject-from-student/${id}`
    );
};

const SubjectService = {
    getSubjects,
    deleteSubjectsById,
    getSubjectsByGradeId,
    getGrades,
    addSubject,
    getSubjectById,
    updateSubject,
    getStudentBySubject,
    addSubjectToStudent,
    getSubjectByStudentId,
};

export default SubjectService;
