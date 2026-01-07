
import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { Login } from '../page/Auth/Login';
import { Register } from '../page/Auth/Register';
import { ExamList } from '../page/Dashboard/ExamList';
import { DashboardPage } from '../page/Dashboard/DashboardPage';
import { Result } from '../page/Dashboard/Result';
import { Settings } from '../page/Dashboard/Settings';
import { InstructionPage } from '../page/ExamPenel/InstructionPage';
import { SystemCheckPage } from '../page/ExamPenel/SystemCheckPage';
import { ExamPage } from '../page/ExamPenel/ExamPage';
import PrivateRoute from '../Components/PrivateRoute';
import MainLayout from '../Components/Layout/MainLayout';

const AppRoutes = () => {
    const routes = useRoutes([
        // Public Routes
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Register />
        },

        // Protected Routes with Layout
        {
            element: (
                <PrivateRoute>
                    <MainLayout />
                </PrivateRoute>
            ),
            children: [
                {
                    path: '/dashboard',
                    element: <DashboardPage />
                },
                {
                    path: '/exams',
                    element: <ExamList />
                },
                {
                    path: '/results',
                    element: <Result />
                },
                {
                    path: '/settings',
                    element: <Settings />
                },
            ]
        },

        // Dedicated Exam Routes (No Layout, Full Screen)
        {
            path: '/exam/:examId/instructions',
            element: (
                <PrivateRoute>
                    <InstructionPage />
                </PrivateRoute>
            )
        },
        {
            path: '/exam/:examId/check',
            element: (
                <PrivateRoute>
                    <SystemCheckPage />
                </PrivateRoute>
            )
        },
        {
            path: '/exam/:examId/start',
            element: (
                <PrivateRoute>
                    <ExamPage />
                </PrivateRoute>
            )
        },

        // Redirect root to dashboard (which will be handled by the protected route logic above)
        {
            path: '/',
            element: <Navigate to="/dashboard" replace />
        },

        // Fallback
        {
            path: '*',
            element: <Navigate to="/dashboard" replace />
        }
    ]);

    return routes;
};

export default AppRoutes;
