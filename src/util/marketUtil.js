import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';



function MyMarketRedirect() {
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            // 로그인된 사용자가 있으면 자신의 상점 페이지로 리다이렉트
            navigate(`/${user.uid}/myMarket`);
        } else {
            // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
            // 만약 별도의 로그인 페이지가 없다면 홈페이지나 다른 적절한 페이지로 리다이렉트
            navigate('/sign_up');
        }
    }, [navigate, auth]);

    return <div>리다이렉트 중...</div>;
}

export default MyMarketRedirect;