export const API_ENDPOINT_URL = '/api/v1';
export const PAGINATION = {
  page: 0,
  rowsPerPage: 20
};
export const DND_DELAY = 200;
export const COURSE_STEPS = {
  1: 'Add information',
  2: 'Add curriculum',
  3: 'Add a price',
  4: 'Publish'
};

export const PRICING_PLAN_TYPES = [
  { id: 1, type: 'free', name: 'Free', title: 'Free Course', description: 'No Payments', isRecurring: false },
  {
    id: 2,
    type: 'subscription',
    name: 'Subscription',
    title: 'Subscription Course',
    description: 'Montly or Annual Billing',
    isRecurring: true
  },
  {
    id: 3,
    type: 'one-time',
    name: 'One-Time Purchase',
    title: 'Paid Course',
    description: 'A Single Payment',
    isRecurring: true
  },
  { id: 4, type: 'payment-plan', name: 'Payment Plan', description: 'A Fixed Number of Payments', isRecurring: true }
];
