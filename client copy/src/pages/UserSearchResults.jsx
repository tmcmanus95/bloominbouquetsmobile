import { useQuery } from "@apollo/client";
import { QUERY_USERS } from "../utils/queries";
import { useParams, Link } from "react-router-dom";
export default function UserSearchResults() {
  const { searchTerm } = useParams();
  const { loading, error, data } = useQuery(QUERY_USERS, {
    variables: { username: searchTerm },
  });
  if (data) {
    console.log("data", data);
  }
  return (
    <div>
      <h1 className="text-2xl ml-5 mt-20 text-decoration-line: underline">
        User Results
      </h1>
      {data ? (
        <div>
          {data.searchUsers ? (
            <Link to={`/user/${data.searchUsers._id}`}>
              <h1 className="ml-5">{data.searchUsers.username}</h1>
            </Link>
          ) : (
            <h1 className="ml-5">
              No users with the username "{searchTerm}" found
            </h1>
          )}
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
