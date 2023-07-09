import { useAuth } from '@/features/auth';
import { MDBBtn } from 'mdb-react-ui-kit';

export default function Logout() {
    const { logout } = useAuth();

    return (
        <MDBBtn className="" onClick={() => logout()}>
            Logout
        </MDBBtn>
    );
}
