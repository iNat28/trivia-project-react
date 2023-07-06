import { useAuth } from '@/features/auth';

export default function Logout() {
    const { logout } = useAuth();

    return <button onClick={() => logout()}>Logout</button>;
}
