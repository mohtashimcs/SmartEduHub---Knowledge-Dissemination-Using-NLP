import { useParams } from "react-router-dom";
import { QueryMenu } from "./QueryMenu";
import { UserProfile } from "./UserProfile";
export const ProfileHome = () => {
  let { queryUserId } = useParams();
  return (
    <>
      {console.log("Pram" + queryUserId)}
      {queryUserId && <UserProfile UserID={queryUserId} />}
      {queryUserId && <QueryMenu FetchId={queryUserId} />}
    </>
  );
};
