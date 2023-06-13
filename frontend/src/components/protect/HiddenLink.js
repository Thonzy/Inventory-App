import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";

export const ShowOnLogin = ({ children }) => {
    const IsLoggedIn = useSelector(selectIsLoggedIn);

    if (IsLoggedIn) {
        return <> {children}</>;
    }
    return null;
};

export const ShowOnLogout = ({ children }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    if (!isLoggedIn) {
        return <> {children}</>;
    }
    return null;
};