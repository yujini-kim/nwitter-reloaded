import { Navigate } from "react-router-dom";
import { auth } from "../routes/firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  //유저가 로그인 했는지 여부
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
