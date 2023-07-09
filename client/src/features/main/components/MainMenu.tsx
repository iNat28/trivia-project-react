import { useAuth } from '@/features/auth';
import Logout from './Logout';

export default function MainMenu() {
    const { userInfo } = useAuth();

    if (!userInfo) {
        console.log('error');
        return <div>Error using userInfo</div>;
    }

    return (
        <>
            <div className="p-5 text-center bg-light mb-5">
                <h1 className="mb-3">Welcome {userInfo.username}!</h1>
                <Logout />
            </div>
        </>
    );
}
