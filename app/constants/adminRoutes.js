// @material-ui/icons
// import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
// core components/views for Admin layout
// import UserProfile from 'views/UserProfile/UserProfile.jsx';
import Users from 'containers/Users/Users';
import Roles from 'containers/Roles/Roles';
import Permissions from 'containers/Permissions/Permissions';
import routes from 'constants/routes.json';

const dashboardRoutes = [
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   icon: Dashboard,
  //   component: DashboardPage,
  //   layout: '/admin'
  // },
  // {
  //   path: '/user',
  //   name: 'User Profile',
  //   icon: Person,
  //   component: UserProfile,
  //   layout: '/admin'
  // },
  {
    path: '/users',
    name: 'Users',
    icon: Person,
    component: Users,
    layout: routes.ADMIN
  },
  {
    path: '/roles',
    name: 'Roles',
    icon: Person,
    component: Roles,
    layout: routes.ADMIN
  },
  {
    path: '/permissions',
    name: 'Permissions',
    icon: Person,
    component: Permissions,
    layout: routes.ADMIN
  }
];

export default dashboardRoutes;
