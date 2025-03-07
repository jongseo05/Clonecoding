import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser({
                    id: user.uid,  // ✅ 실제 UID 사용
                    name: user.displayName || "익명 사용자",
                    email: user.email,
                    image: user.photoURL || "/default-profile.png",
                });
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return { currentUser };
};

export default useCurrentUser;