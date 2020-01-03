import {
  Person,
  DashboardOutlined,
  Ballot,
  PeopleOutlined,
  Web,
  VideoLibrary,
  TrendingUp,
  SettingsApplications
} from '@material-ui/icons';
import HomePage from 'containers/HomePage';
import Users from 'containers/Admin/Users/Users';
import Roles from 'containers/Admin/Roles/Roles';
import Role from 'containers/Admin/Roles/Role';
import ProfilePage from 'containers/Admin/ProfilePage';
import CoursesPage from 'containers/Admin/CoursesPage';
import NewCourse from 'containers/Admin/CoursesPage/Course';
import Permissions from 'containers/Admin/Permissions/Permissions';
import routes from 'constants/routes.json';
import UsersFilterPage from 'containers/Admin/UsersFilterPage/UsersFilterPage';
import CourseCurriculum from 'containers/Admin/CoursesPage/CourseCurriculum';
import PricingPlans from 'containers/Admin/PricingPlans';
import LecturePage from 'containers/Admin/LecturePage';

const dashboardRoutes = [
  {
    path: routes.DASHBOARD,
    name: 'Dashboard',
    icon: DashboardOutlined,
    component: HomePage,
    layout: routes.ADMIN,
    visible: true
  },
  {
    path: routes.USERS,
    name: 'Users',
    icon: PeopleOutlined,
    component: Users,
    layout: routes.ADMIN,
    visible: true,
    children: [
      {
        path: routes.FILTER,
        link: routes.FILTER.replace(':role', 'admin'),
        name: 'Admins',
        component: UsersFilterPage,
        layout: routes.ADMIN,
        visible: true
      },
      {
        path: routes.FILTER,
        link: routes.FILTER.replace(':role', 'student'),
        name: 'Students',
        component: UsersFilterPage,
        layout: routes.ADMIN,
        visible: true
      }
    ]
  },
  {
    path: routes.SITE,
    name: 'Site',
    icon: Web,
    component: HomePage,
    layout: routes.ADMIN,
    visible: true
  },
  {
    path: routes.SALES,
    name: 'Sales',
    icon: TrendingUp,
    component: HomePage,
    layout: routes.ADMIN,
    visible: true
  },
  {
    path: routes.COURSES,
    name: 'Courses',
    icon: VideoLibrary,
    component: CoursesPage,
    layout: routes.ADMIN,
    visible: true
  },
  {
    path: routes.PROFILE,
    name: 'Profile',
    icon: Person,
    component: ProfilePage,
    layout: routes.ADMIN,
    visible: true
  },
  {
    path: routes.SETTINGS,
    name: 'Settings',
    icon: SettingsApplications,
    component: HomePage,
    layout: routes.ADMIN,
    visible: true,
    children: [
      {
        path: routes.ROLE,
        name: 'Role',
        icon: Person,
        component: Role,
        layout: routes.ADMIN,
        visible: false
      },
      {
        path: routes.ROLES,
        name: 'Roles',
        icon: Person,
        component: Roles,
        layout: routes.ADMIN,
        visible: true
      },
      {
        path: routes.PERMISSIONS,
        name: 'Permissions',
        icon: Ballot,
        component: Permissions,
        layout: routes.ADMIN,
        visible: true
      }
    ]
  },
  {
    path: routes.NEW_COURSE,
    name: 'New CourseAdmin',
    icon: VideoLibrary,
    component: NewCourse,
    layout: routes.ADMIN,
    visible: false
  },
  {
    path: routes.CURRICULUM,
    name: 'Curriculum',
    icon: VideoLibrary,
    component: CourseCurriculum,
    layout: routes.ADMIN,
    visible: false
  },
  {
    path: routes.PRICING_PLAN,
    name: 'Pricing',
    icon: VideoLibrary,
    component: PricingPlans,
    layout: routes.ADMIN,
    visible: false
  },
  {
    path: routes.NEW_PRICING_PLAN,
    name: 'Pricing',
    icon: VideoLibrary,
    component: PricingPlans,
    layout: routes.ADMIN,
    visible: false
  },
  {
    path: routes.NEW_LECTURE,
    name: 'Lecture',
    icon: VideoLibrary,
    component: LecturePage,
    layout: routes.ADMIN,
    visible: false
  }
];

export default dashboardRoutes;
