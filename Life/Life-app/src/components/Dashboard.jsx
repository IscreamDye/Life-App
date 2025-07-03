import { UserContext } from './userContext';
import { useContext } from 'react';

export default function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h1>DashBoard</h1>
      {!!user && (<h1>Hi {user.username}!</h1>)}
    </div>
  )
}
