
import { History } from '@remix-run/router';
import React from 'react';
import {
    RouterProvider,
    createHashRouter,
    Outlet,
    useLocation
} from 'react-router-dom';

import { DASHBOARD_APP_PATHS, DASHBOARD_APP_ROUTES } from 'apps/dashboard/routes/routes';
import { EXPERIMENTAL_APP_ROUTES } from 'apps/experimental/routes/routes';
import { STABLE_APP_ROUTES } from 'apps/stable/routes/routes';
import AppHeader from 'components/AppHeader';
import Backdrop from 'components/Backdrop';
import { useLegacyRouterSync } from 'hooks/useLegacyRouterSync';
import UserThemeProvider from 'themes/UserThemeProvider';

const layoutMode = localStorage.getItem('layout');
const isExperimentalLayout = layoutMode === 'experimental';

const router = createHashRouter([
    {
        element: <RootAppLayout />,
        children: [
            ...(isExperimentalLayout ? EXPERIMENTAL_APP_ROUTES : STABLE_APP_ROUTES),
            ...DASHBOARD_APP_ROUTES
        ]
    }
]);

export default function RootAppRouter({ history }: Readonly<{ history: History}>) {
    useLegacyRouterSync({ router, history });

    return <RouterProvider router={router} />;
}

/**
 * Layout component that renders legacy components required on all pages.
 * NOTE: The app will crash if these get removed from the DOM.
 */
function RootAppLayout() {
    const location = useLocation();
    const isNewLayoutPath = Object.values(DASHBOARD_APP_PATHS)
        .some(path => location.pathname.startsWith(`/${path}`));

    return (
        <UserThemeProvider>
            <Backdrop />
            <AppHeader isHidden={isExperimentalLayout || isNewLayoutPath} />

            <Outlet />
        </UserThemeProvider>
    );
}
