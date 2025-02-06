import { useParams } from "react-router-dom"; // ✅ React Router 사용
import { useCurrentUser } from "./useCurrentUser"; // ✅ useCurrentUser import 추가
import Channel from "./Components/Channel";

const ChatPage = () => {
    const { id } = useParams;
    const { currentUser } = useCurrentUser();

    return <>{currentUser && <Channel id={id} />}</>;
};

export default ChatPage;
