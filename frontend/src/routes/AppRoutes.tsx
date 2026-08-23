import {BrowserRouter, Route, Routes} from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import FuncionariosPage from "../pages/FuncionariosPage";
import NovoFuncionarioPage from "../pages/NovoFuncionarioPage";
import FuncionarioDetalhePage from "../pages/FuncionarioDetalhePage";
import EditarFuncionarioPage from "../pages/EditarFuncionarioPage";
import Layout from "../components/Layout";

function withLayout(element: React.ReactNode) {
    return <Layout>{element}</Layout>;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={withLayout(<DashboardPage/>)} />

                <Route path="/funcionarios" element={withLayout(<FuncionariosPage/>)} />

                <Route path="/funcionarios/novo" element={withLayout(<NovoFuncionarioPage/>)} />

                <Route path="/funcionarios/:id" element={withLayout(<FuncionarioDetalhePage/>)} />

                <Route path="/funcionarios/:id/editar" element={withLayout(<EditarFuncionarioPage/>)} />
            </Routes>
        </BrowserRouter>
    )
}
