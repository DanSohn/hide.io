import React from 'react';
import {Route, Redirect} from "react-router-dom";
import { auth } from "../Router";

export default function ProtectedRoute({component: Component, ...rest}) {
    return (
        <Route
            {...rest}
            render={props => {
                if (auth.isAuthenticated) {
                    console.log("auth is currently authenticated");
                    return <Component {...props} />
                } else {
                    console.log("auth is NOT authenticated");

                    return <Redirect
                        to={{
                            pathname: "/",
                            state: {from: props.location}
                        }}
                    />
                }
            }
            }
        />
    );
}