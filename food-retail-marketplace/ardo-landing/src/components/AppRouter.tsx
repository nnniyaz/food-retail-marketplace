import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {publicRoutes, RouteNames} from "../routes";

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(route => <Route path={route.path} element={<route.element/>} key={route.path}/>)}
            <Route path={'*'} element={<Navigate to={RouteNames.MAIN}/>}/>
        </Routes>
    );
};

export default AppRouter;
