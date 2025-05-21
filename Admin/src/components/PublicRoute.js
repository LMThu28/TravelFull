import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ children, ...rest }) => {

    const checkAuth = () => {
        if (localStorage.getItem('token') !== null) return false;
        return true;
    }

    return (
        <Route
            {...rest}
            render={({ location }) =>
                checkAuth() ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/dash-board",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

export default PublicRoute;