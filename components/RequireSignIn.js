import { useUser } from './User';

export default function RequireSignIn({ children }) {
  const me = useUser();
  if (!me) return null;
  return children;
}
