import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';
import OrderList from '../pages/OrderList/orderList';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AccountManagement = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/accountManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ChangePassword = lazy(() => {
    return Promise.all([
        import('../pages/ChangePassword/changePassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetCategory = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetCategory/assetCategory'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetManagement/assetManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const ResetPassword = lazy(() => {
    return Promise.all([
        import('../pages/ResetPassword/resetPassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const DashBoard = lazy(() => {
    return Promise.all([
        import('../pages/DashBoard/dashBoard'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const NewsList = lazy(() => {
    return Promise.all([
        import('../pages/News/news'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AreaManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AreaManagement/areaManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Register = lazy(() => {
    return Promise.all([
        import('../pages/Register/register'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const HotelsManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/HotelsManagement/HotelsManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RoomTypesManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/RoomTypesManagement/RoomTypesManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RoomsManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/RoomsManagement/RoomsManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ServiceManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ServiceManagement/ServiceManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ToursManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ToursManagement/ToursManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const TourBookings = lazy(() => {
    return Promise.all([
        import('../pages/Admin/TourBookings/TourBookings'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const TourCategories = lazy(() => {
    return Promise.all([
        import('../pages/Admin/TourCategories/TourCategories'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const TourSchedulesManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/TourSchedulesManagement/TourSchedulesManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RouterURL = withRouter(({ location }) => {


    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>
            <PublicRoute exact path="/reset-password/:id">
                <ResetPassword />
            </PublicRoute>
            <PublicRoute exact path="/register">
                <Register />
            </PublicRoute>
        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 55 }}>
                        <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/profile">
                            <Suspense fallback={<LoadingScreen />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/change-password/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <ChangePassword />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/area-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AreaManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/asset-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetCategory />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/asset-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/news-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <NewsList />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>

                        <PrivateRoute exact path="/hotels-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <HotelsManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/room-types-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <RoomTypesManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/rooms-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <RoomsManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/ticket-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderList />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/service-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ServiceManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/tours-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ToursManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/tour-bookings">
                            <Suspense fallback={<LoadingScreen />}>
                                <TourBookings />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/tour-categories">
                            <Suspense fallback={<LoadingScreen />}>
                                <TourCategories />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/tour-schedules">
                            <Suspense fallback={<LoadingScreen />}>
                                <TourSchedulesManagement />
                            </Suspense>
                        </PrivateRoute>

                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/register">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/reset-password/:id">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/change-password/:id">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/area-management">
                        <DefaultContainer />
                    </Route>


                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-list">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/flights-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/room-types-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/sales-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/rooms-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/maintenance-history">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-report">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-event">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-event-details/:id">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-rules">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/customer-enrollment">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/room-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/tour-categories">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/complaint-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/reception-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/ticket-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/news-list">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/hotels-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/order-list">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/employee-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/notifications">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/tournament">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/product-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/product-type-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/tours-management" >
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/service-management" >
                        <DefaultContainer />
                    </Route>
                    
                    <Route exact path="/tour-bookings" >
                        <DefaultContainer />
                    </Route>
                    
                    <Route exact path="/tour-schedules">
                        <DefaultContainer />
                    </Route>

                    <Route>

                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
