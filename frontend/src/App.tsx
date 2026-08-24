import AppRoutes from "./routes/AppRoutes.tsx";
import ApiErrorToast from "./components/ApiErrorToast.tsx";

function App() {
  return (
    <>
      <ApiErrorToast/>
      <AppRoutes/>
    </>
  );
}

export default App
