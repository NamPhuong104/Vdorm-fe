export const ALL_MODULES = {
  AUTH: 'AUTH',
  DASHBOARD: 'DASHBOARD',
  STATISTIC: 'STATISTIC',
  BRANCHES: 'BRANCHES',
  MAJORS: 'MAJORS',
  SERVICE_TYPES: 'SERVICE TYPES',
  ROOM_TYPES: 'ROOM TYPES',
  ROOMS: 'ROOMS',
  ROLES: 'ROLES',
  PERMISSIONS: 'PERMISSIONS',
  STUDENTS: 'STUDENTS',
  STUDENT_PROFILES: 'STUDENT PROFILES',
  VIOLATIONS: 'VIOLATIONS',
  CHECK_IN_OUT: 'CHECK IN/OUT',
  USERS: 'USERS',
  INFRASTRUCTURE_TYPES: 'INFRASTRUCTURE TYPES',
  INFRASTRUCTURES: 'INFRASTRUCTURES',
  INFRASTRUCTURE_QR_CODES: 'INFRASTRUCTURE QR CODES',
  MAINTENANCES: 'MAINTENANCES',
  REGISTRATIONS: 'REGISTRATIONS',
  CONTRACTS: 'CONTRACTS',
  INVOICES: 'INVOICES',
  INVOICE_DETAILS: 'INVOICE DETAILS',
  CONTACTS: 'CONTACTS',
  NEWS: 'NEWS',
  NOTIFICATIONS: 'NOTIFICATIONS',
  CONTENTS: 'CONTENTS',
  FILES: 'FILES',
  EMAILS: 'EMAILS',
};

export const ALL_PERMISSIONS = {
  DASHBOARD: {
    COUNT_BRANCH: {
      method: 'GET',
      apiPath: '/api/v1/branches/dashboard',
      module: 'DASHBOARD',
    },
    COUNT_ROOM: {
      method: 'GET',
      apiPath: '/api/v1/rooms/dashboard',
      module: 'DASHBOARD',
    },
    COUNT_INFRASTRUCTURE: {
      method: 'GET',
      apiPath: '/api/v1/infrastructures/dashboard',
      module: 'DASHBOARD',
    },
    COUNT_SERVICE_TYPE: {
      method: 'GET',
      apiPath: '/api/v1/service-types/dashboard',
      module: 'DASHBOARD',
    },
    COUNT_USER: {
      method: 'GET',
      apiPath: '/api/v1/users/dashboard',
      module: 'DASHBOARD',
    },
    COUNT_STUDENT: {
      method: 'GET',
      apiPath: '/api/v1/students/dashboard',
      module: 'DASHBOARD',
    },
    CALCULATE_REVENUE: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/dashboard/revenue',
      module: 'DASHBOARD',
    },
    CALCULATE_PROGRESS: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/dashboard/progress',
      module: 'DASHBOARD',
    },
    CALCULATE_SERVICE: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/dashboard/service',
      module: 'DASHBOARD',
    },
    CALCULATE_MAINTENANCE: {
      method: 'GET',
      apiPath: '/api/v1/maintenances/dashboard/maintenance',
      module: 'DASHBOARD',
    },
  },
  STATISTIC: {
    REVENUE: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/statistic/revenue',
      module: 'STATISTIC',
    },
    PROGRESS: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/statistic/progress',
      module: 'STATISTIC',
    },
    SERVICE: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/statistic/service',
      module: 'STATISTIC',
    },
    MAINTENANCE: {
      method: 'GET',
      apiPath: '/api/v1/maintenances/statistic/maintenance',
      module: 'STATISTIC',
    },
    STUDENT_PROFILE: {
      method: 'GET',
      apiPath: '/api/v1/student-profiles/statistic/student',
      module: 'STATISTIC',
    },
    REVENUE_EXPORT: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/statistic/revenue/export',
      module: 'STATISTIC',
    },
    PROGRESS_EXPORT: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/statistic/progress/export',
      module: 'STATISTIC',
    },
    SERVICE_EXPORT: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/statistic/service/export',
      module: 'STATISTIC',
    },
    MAINTENANCE_EXPORT: {
      method: 'GET',
      apiPath: '/api/v1/maintenances/statistic/maintenance/export',
      module: 'STATISTIC',
    },
    STUDENT_PROFILE_EXPORT: {
      method: 'GET',
      apiPath: '/api/v1/student-profiles/statistic/student/export',
      module: 'STATISTIC',
    },
  },
  BRANCHES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/branches',
      module: 'BRANCHES',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/branches',
      module: 'BRANCHES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/branches',
      module: 'BRANCHES',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/branches/:id',
      module: 'BRANCHES',
    },
  },
  MAJORS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/majors',
      module: 'MAJORS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/majors',
      module: 'MAJORS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/majors',
      module: 'MAJORS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/majors/:id',
      module: 'MAJORS',
    },
  },
  SERVICE_TYPES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/service-types',
      module: 'SERVICE TYPES',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/service-types',
      module: 'SERVICE TYPES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/service-types',
      module: 'SERVICE TYPES',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/service-types/:id',
      module: 'SERVICE TYPES',
    },
  },
  ROOM_TYPES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/room-types',
      module: 'ROOM TYPES',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/room-types',
      module: 'ROOM TYPES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/room-types',
      module: 'ROOM TYPES',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/room-types/:id',
      module: 'ROOM TYPES',
    },
  },
  ROOMS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/rooms',
      module: 'ROOMS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/rooms',
      module: 'ROOMS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/rooms',
      module: 'ROOMS',
    },
    PATCH_STUDENT: {
      method: 'PATCH',
      apiPath: '/api/v1/rooms/student-list',
      module: 'ROOMS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/rooms/:id',
      module: 'ROOMS',
    },
  },
  ROLES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/roles',
      module: 'ROLES',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/roles',
      module: 'ROLES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/roles',
      module: 'ROLES',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/roles/:id',
      module: 'ROLES',
    },
  },
  PERMISSIONS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/permissions',
      module: 'PERMISSIONS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/permissions',
      module: 'PERMISSIONS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/permissions',
      module: 'PERMISSIONS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/permissions/:id',
      module: 'PERMISSIONS',
    },
  },
  STUDENTS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/students',
      module: 'STUDENTS',
    },
  },
  VIOLATIONS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/violations',
      module: 'VIOLATIONS',
    },
    GET_STUDENT: {
      method: 'GET',
      apiPath: '/api/v1/violations/student',
      module: 'VIOLATIONS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/violations',
      module: 'VIOLATIONS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/violations',
      module: 'VIOLATIONS',
    },
    PATCH_STATUS: {
      method: 'PATCH',
      apiPath: '/api/v1/violations/status',
      module: 'VIOLATIONS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/violations/:id',
      module: 'VIOLATIONS',
    },
  },
  STUDENT_PROFILES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/student-profiles',
      module: 'STUDENT PROFILES',
    },
    GET_STUDENT: {
      method: 'GET',
      apiPath: '/api/v1/student-profiles/:id',
      module: 'STUDENT PROFILES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/student-profiles',
      module: 'STUDENT PROFILES',
    },
  },
  CHECK_IN_OUT: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/check-in-out',
      module: 'CHECK IN/OUT',
    },
    GET_STUDENT: {
      method: 'GET',
      apiPath: '/api/v1/check-in-out/student',
      module: 'CHECK IN/OUT',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/check-in-out',
      module: 'CHECK IN/OUT',
    },
    EXPORT_STATISTIC: {
      method: 'GET',
      apiPath: '/api/v1/check-in-out/statistic/export',
      module: 'CHECK IN/OUT',
    },
  },
  USERS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/users',
      module: 'USERS',
    },
    POST_NEW: {
      method: 'POST',
      apiPath: '/api/v1/users/new',
      module: 'USERS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/users',
      module: 'USERS',
    },
  },
  INFRASTRUCTURE_TYPES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/infrastructure-types',
      module: 'INFRASTRUCTURE TYPES',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/infrastructure-types',
      module: 'INFRASTRUCTURE TYPES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/infrastructure-types',
      module: 'INFRASTRUCTURE TYPES',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/infrastructure-types/:id',
      module: 'INFRASTRUCTURE TYPES',
    },
  },
  INFRASTRUCTURES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/infrastructures',
      module: 'INFRASTRUCTURES',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/infrastructures',
      module: 'INFRASTRUCTURES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/infrastructures',
      module: 'INFRASTRUCTURES',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/infrastructures/:id',
      module: 'INFRASTRUCTURES',
    },
  },
  INFRASTRUCTURE_QR_CODE: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/infrastructure-qr-codes',
      module: 'INFRASTRUCTURE QR CODE',
    },
  },
  MAINTENANCES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/maintenances',
      module: 'MAINTENANCES',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/maintenances',
      module: 'MAINTENANCES',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/maintenances',
      module: 'MAINTENANCES',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/maintenances/:id',
      module: 'MAINTENANCES',
    },
  },
  REGISTRATIONS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/registrations',
      module: 'REGISTRATIONS',
    },
    GET_STUDENT: {
      method: 'GET',
      apiPath: '/api/v1/registrations/student',
      module: 'REGISTRATIONS',
    },
    GET_MANY_STATUS: {
      method: 'GET',
      apiPath: '/api/v1/registrations/many-status',
      module: 'REGISTRATIONS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/registrations',
      module: 'REGISTRATIONS',
    },
    POST_ARRANGE: {
      method: 'POST',
      apiPath: '/api/v1/registrations/arrange-auto',
      module: 'REGISTRATIONS',
    },
    POST_ROOM: {
      method: 'POST',
      apiPath: '/api/v1/registrations/arrange-room',
      module: 'REGISTRATIONS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/registrations',
      module: 'REGISTRATIONS',
    },
    PATCH_STATUS: {
      method: 'PATCH',
      apiPath: '/api/v1/registrations/status',
      module: 'REGISTRATIONS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/registrations/:id',
      module: 'REGISTRATIONS',
    },
  },
  CONTRACTS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/contracts',
      module: 'CONTRACTS',
    },
    GET_ID: {
      method: 'GET',
      apiPath: '/api/v1/contracts/:id',
      module: 'CONTRACTS',
    },
    GET_STUDENT: {
      method: 'GET',
      apiPath: '/api/v1/contracts/student',
      module: 'CONTRACTS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/contracts',
      module: 'CONTRACTS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/contracts',
      module: 'CONTRACTS',
    },
    PATCH_STATUS: {
      method: 'PATCH',
      apiPath: '/api/v1/contracts/status',
      module: 'CONTRACTS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/contracts/:id',
      module: 'CONTRACTS',
    },
  },
  INVOICES: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/invoices',
      module: 'INVOICES',
    },
  },
  INVOICE_DETAILS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details',
      module: 'INVOICE DETAILS',
    },
    GET_STUDENT: {
      method: 'GET',
      apiPath: '/api/v1/invoice-details/student',
      module: 'INVOICE DETAILS',
    },
    POST_CREATE_MANY: {
      method: 'POST',
      apiPath: '/api/v1/invoice-details/create-many',
      module: 'INVOICE DETAILS',
    },
    POST_ELECTRICITY: {
      method: 'POST',
      apiPath: '/api/v1/invoice-details/electricity',
      module: 'INVOICE DETAILS',
    },
    POST_STATUS: {
      method: 'POST',
      apiPath: '/api/v1/invoice-details/status',
      module: 'INVOICE DETAILS',
    },
    POST_REMOVE_MANY: {
      method: 'POST',
      apiPath: '/api/v1/invoice-details/remove-many',
      module: 'INVOICE DETAILS',
    },
  },
  CONTACTS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/contacts',
      module: 'CONTACTS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/contacts',
      module: 'CONTACTS',
    },
    PATCH_REPLY: {
      method: 'PATCH',
      apiPath: '/api/v1/contacts/reply',
      module: 'CONTACTS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/contacts/:id',
      module: 'CONTACTS',
    },
  },
  NEWS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/news',
      module: 'NEWS',
    },
    GET_ID: {
      method: 'GET',
      apiPath: '/api/v1/news/:id',
      module: 'NEWS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/news',
      module: 'NEWS',
    },
    POST_THUMBNAIL: {
      method: 'POST',
      apiPath: '/api/v1/news/thumbnail',
      module: 'NEWS',
    },
    POST_IMAGE: {
      method: 'POST',
      apiPath: '/api/v1/news/image',
      module: 'NEWS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/news',
      module: 'NEWS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/news/:id',
      module: 'NEWS',
    },
  },
  NOTIFICATIONS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/notifications',
      module: 'NOTIFICATIONS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/notifications',
      module: 'NOTIFICATIONS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/notifications',
      module: 'NOTIFICATIONS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/notifications/:id',
      module: 'NOTIFICATIONS',
    },
  },
  CONTENTS: {
    GET: {
      method: 'GET',
      apiPath: '/api/v1/contents',
      module: 'CONTENTS',
    },
    POST: {
      method: 'POST',
      apiPath: '/api/v1/contents',
      module: 'CONTENTS',
    },
    PATCH: {
      method: 'PATCH',
      apiPath: '/api/v1/contents',
      module: 'CONTENTS',
    },
    DELETE: {
      method: 'DELETE',
      apiPath: '/api/v1/contents/:id',
      module: 'CONTENTS',
    },
  },
  FILES: {
    GET_REGISTRATION: {
      method: 'GET',
      apiPath: '/api/v1/files/registration/export',
      module: 'FILES',
    },
    POST_REGISTRATION: {
      method: 'POST',
      apiPath: '/api/v1/files/registration',
      module: 'FILES',
    },
  },
  EMAILS: {
    GET_INVOICE: {
      method: 'GET',
      apiPath: '/api/v1/emails',
      module: 'EMAILS',
    },
  },
};
