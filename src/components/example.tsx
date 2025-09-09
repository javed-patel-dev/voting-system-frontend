import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setUser, clearUser } from '../store/slices/userSlice';

export const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h1>User Email: {user.email}</h1>
      <button onClick={() => dispatch(setUser({ email: 'test@example.com', role: 'VOTER' }))}>
        Set User
      </button>
      <button onClick={() => dispatch(clearUser())}>Clear User</button>
    </div>
  );
};
