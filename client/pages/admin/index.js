import Layout from '../../components/Layout';
import { isAuth, logout } from '../../helpers/auth';

const Admin = () => { return <Layout>hello {isAuth().name}</Layout>}

export default Admin;

