export const adminPermissions = {
  user: {
    create: 'ADMIN_CREATE_USER',
    delete: 'ADMIN_DELETE_USER',
    update: 'ADMIN_UPDATE_USER',
    view: 'ADMIN_VIEW_USER'
  },
  company: {
    create: 'ADMIN_CREATE_COMPANY',
    delete: 'ADMIN_DELETE_COMPANY',
    update: 'ADMIN_UPDATE_COMPANY',
    view: 'ADMIN_VIEW_COMPANY'
  },
  project: {
    approve: 'ADMIN_APPROVE_PROJECT',
    requestEdit: 'ADMIN_REQUEST_EDIT_PROJECT',
    cancel: 'ADMIN_CANCEL_PROJECT',
    complete: 'ADMIN_COMPLETE_PROJECT',
    view: 'ADMIN_VIEW_PROJECT'
  },
  role: {
    create: 'ADMIN_CREATE_ROLE',
    delete: 'ADMIN_DELETE_ROLE',
    update: 'ADMIN_UPDATE_ROLE',
    view: 'ADMIN_VIEW_ROLE'
  },
  quotation: {
    requestEdit: 'REQUEST_EDIT'
  }
}

export const userPermissions = {
  project: {
    cancel: 'CANCEL_PROJECT',
    create: 'CREATE_PROJECT',
    delete: 'DELETE_PROJECT',
    update: 'UPDATE_PROJECT',
    view: 'VIEW_PROJECT',
    viewPublic: 'VIEW_PUBLIC_PROJECT'
  },
  ticket: {
    send: 'SEND_TICKET',
    updateStatus: 'UPDATE_STATUS_TICKET',
    view: 'VIEW_TICKET'
  },
  product: {
    create: 'CREATE_PRODUCT',
    delete: 'DELETE_PRODUCT',
    update: 'UPDATE_PRODUCT',
    view: 'VIEW_PRODUCT'
  },
  user: {
    changePassword: 'CHANGE_MY_PASSWORD',
    updateProfile: 'UPDATE_MY_PROFILE'
  },
  quotation: {
    approve: 'APPROVE_QUOTATION',
    create: 'CREATE_QUOTATION',
    delete: 'DELETE_QUOTATION',
    update: 'UPDATE_QUOTATION',
    view: 'VIEW_QUOTATION'
  }
}
