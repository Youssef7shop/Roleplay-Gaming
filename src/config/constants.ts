export const ADMIN_ROUTE = '/admin-panel';

export const ADMIN_ROUTES = {
  DASHBOARD: `${ADMIN_ROUTE}`,
  APPLICATIONS: `${ADMIN_ROUTE}/applications`,
  PENDING: `${ADMIN_ROUTE}/applications?status=pending`,
  ACCEPTED: `${ADMIN_ROUTE}/applications?status=accepted`,
  REJECTED: `${ADMIN_ROUTE}/applications?status=rejected`,
  USERS: `${ADMIN_ROUTE}/users`,
  CONTROL: `${ADMIN_ROUTE}/control`,
  LOGS: `${ADMIN_ROUTE}/logs`,
  SETTINGS: `${ADMIN_ROUTE}/settings`,
};
