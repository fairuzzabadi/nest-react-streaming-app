import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError() as string;
  return <p>{error}</p>;
}

export default ErrorPage;
