import { filter } from 'lodash';
import {
  GET_PERMISSIONS_SUCCESS,
  GET_PERMISSIONS_FAILED,
  CREATE_PERMISSIONS_SUCCESS,
  CREATE_PERMISSIONS_FAILED,
  DELETE_PERMISSIONS_SUCCESS,
  DELETE_PERMISSIONS_FAILED,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAILED,
  CREATE_ROLE_SUCCESS,
  CREATE_ROLE_FAILED,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAILED,
  GET_USERS_SUCCESS,
  GET_USERS_FAILED,
  CREATE_USERS_SUCCESS,
  CREATE_USERS_FAILED,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAILED,
  GET_ROLE_SUCCESS,
  GET_ROLE_FAILED,
  GET_FILTERS_SUCCESS,
  GET_FILTERS_FAILED
} from 'constants/actionTypes';

const initialState = {
  permissions: {
    data: [],
    total: 0
  },
  roles: {
    data: [],
    total: 0
  },
  users: {
    data: [],
    total: 0
  },
  filters: [],
  role: {}
};
let temp;
export default function(state = initialState, action) {
  switch (action.type) {
    // Permissions
    case GET_PERMISSIONS_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          permissions: []
        };
      }
      return {
        ...state,
        permissions: {
          data: action.res.data.data,
          total: action.res.data.total
        }
      };
    case GET_PERMISSIONS_FAILED:
      return {
        ...state,
        permissions: []
      };
    case CREATE_PERMISSIONS_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      return {
        ...state,
        permissions: {
          data: [...state.permissions.data, action.res.data],
          total: state.total + 1
        }
      };
    case CREATE_PERMISSIONS_FAILED:
      return {
        ...state
      };
    case DELETE_PERMISSIONS_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      temp = state.permissions.data.filter(item => item.name !== action.res.name);
      return {
        ...state,
        permissions: {
          data: [...temp],
          total: state.total - 1 > 0 ? state.total - 1 : 0
        }
      };
    case DELETE_PERMISSIONS_FAILED:
      return {
        ...state
      };

    // Roles
    case GET_ROLES_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          roles: []
        };
      }
      return {
        ...state,
        roles: {
          data: action.res.data.data,
          total: action.res.data.total
        }
      };
    case GET_ROLES_FAILED:
      return {
        ...state,
        roles: []
      };
    case GET_ROLE_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          role: {}
        };
      }
      return {
        ...state,
        role: action.res.data
      };
    case GET_ROLE_FAILED:
      return {
        ...state,
        role: {}
      };
    case CREATE_ROLE_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      temp = filter(state.roles.data, item => action.res.data.id !== item.id);
      return {
        ...state,
        roles: {
          data: [...temp, action.res.data],
          total: state.total + 1
        }
      };
    case CREATE_ROLE_FAILED:
      return {
        ...state
      };
    case DELETE_ROLE_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      temp = state.roles.data.filter(item => item.name !== action.res.name);
      return {
        ...state,
        roles: {
          data: [...temp],
          total: state.total - 1 > 0 ? state.total - 1 : 0
        }
      };
    case DELETE_ROLE_FAILED:
      return {
        ...state
      };

    // Users
    case GET_USERS_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          users: []
        };
      }
      return {
        ...state,
        users: action.res.data
      };
    case GET_USERS_FAILED:
      return {
        ...state,
        users: []
      };
    case CREATE_USERS_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      return {
        ...state,
        users: [...state.users, action.res.data]
      };
    case CREATE_USERS_FAILED:
      return {
        ...state
      };
    case DELETE_USERS_SUCCESS:
      if (!action.res.success) {
        return {
          ...state
        };
      }
      temp = state.users.filter(item => item.id !== action.res.id);
      return {
        ...state,
        users: [...temp]
      };
    case DELETE_USERS_FAILED:
      return {
        ...state
      };

    // Filters
    case GET_FILTERS_SUCCESS:
      if (!action.res.success) {
        return {
          ...state,
          filters: []
        };
      }
      return {
        ...state,
        filters: action.res.data
      };
    case GET_FILTERS_FAILED:
      return {
        ...state,
        filters: []
      };
    default:
      return state;
  }
}
