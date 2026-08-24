import {useEffect} from "react";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import FuncionariosPage from "../pages/FuncionariosPage";
import NovoFuncionarioPage from "../pages/NovoFuncionarioPage";
import FuncionarioDetalhePage from "../pages/FuncionarioDetalhePage";
import EditarFuncionarioPage from "../pages/EditarFuncionarioPage";
import ErrorPage from "../pages/ErrorPage";
import Layout from "../components/Layout";

function withLayout(element: React.ReactNode) {
    return <Layout>{element}</Layout>;
}

function PageTitle() {
    const {pathname} = useLocation();

    useEffect(() => {
        let page = "Página não encontrada";

        if (pathname === "/") page = "Dashboard";
        else if (pathname === "/funcionarios") page = "Funcionários";
        else if (pathname === "/funcionarios/novo") page = "Novo funcionário";
        else if (/^\/funcionarios\/[^/]+\/editar$/.test(pathname)) page = "Editar funcionário";
        else if (/^\/funcionarios\/[^/]+$/.test(pathname)) page = "Detalhes do funcionário";

        document.title = `PicPay | ${page}`;
    }, [pathname]);

    return null;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <PageTitle/>
            <Routes>
                <Route path="/" element={withLayout(<DashboardPage/>)} />

                <Route path="/funcionarios" element={withLayout(<FuncionariosPage/>)} />

                <Route path="/funcionarios/novo" element={withLayout(<NovoFuncionarioPage/>)} />

                <Route path="/funcionarios/:id" element={withLayout(<FuncionarioDetalhePage/>)} />

                <Route path="/funcionarios/:id/editar" element={withLayout(<EditarFuncionarioPage/>)} />

                <Route path="*" element={withLayout(<ErrorPage/>)} />
            </Routes>
        </BrowserRouter>
    )
}
