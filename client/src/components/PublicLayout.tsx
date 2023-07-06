import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
    return (
        <>
            <div>Public Layout</div>
            <Outlet />
        </>
    );
};
