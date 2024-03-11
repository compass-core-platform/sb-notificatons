export const APIS = {
    create: '/learner/user/feed/v2/create',
    frameworkRead:'/api/framework/v1/read/',
    departmentList: '/learner/user/v1/department/list',
    notificationList: '/learner/user/v1/notification/list/',
    upload:'/api/user/v1/image/upload'
}

export const POSITION_COLUMNS =  ['select', 'position', 'noOfMembers'];
export const ROLE_COLUMNS = ['select', 'role', 'noOfMembers'];
export const DEPARTMENT_COLUMNS = ['select', 'department', 'noOfMembers'];
export const PLATFORM_ROLES = [
      { name: "CONTENT_REVIEWER", noOfMembers:'' },
      { name: "COURSE_MENTOR", noOfMembers:'' },
      { name: "PROGRAM_DESIGNER", noOfMembers:'' },
      { name: "REPORT_ADMIN", noOfMembers:'' },
      { name: "ORG_ADMIN", noOfMembers:'' },
      { name: "BOOK_CREATOR", noOfMembers:'' },
      { name: "BOOK_REVIEWER", noOfMembers:'' },
      { name: "PUBLIC", noOfMembers:'' },
      { name: "PROGRAM_MANAGER", noOfMembers:'' },
      { name: "CONTENT_CREATOR", noOfMembers:'' }
    ];