// 기본적인 유틸리티 함수 정의
export const imageUrl = (url) => url || "/default-avatar.png";

// 현재 로그인된 사용자 정보 (임시 데이터)
export const useCurrentUser = () => {
    return { currentUser: { id: "test-user", name: "테스트 유저", image: "/default-avatar.png" } };
};

// 시간 포맷 함수 (기본적인 변환)
export const timeFormat = (date) => {
    return new Date(date).toLocaleTimeString();
};
