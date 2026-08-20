import {BrowserRouter, Route, Routes} from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import FuncionariosPage from "../pages/FuncionariosPage";
import NovoFuncionarioPage from "../pages/NovoFuncionarioPage";
import FuncionarioDetalhePage from "../pages/FuncionarioDetalhePage";
import EditarFuncionarioPage from "../pages/EditarFuncionarioPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage/>} />

                <Route path="/funcionarios" element={<FuncionariosPage/>}/>

                <Route path="/funcionarios/novo" element={<NovoFuncionarioPage/>}/>

                <Route path="/funcionarios/:id" element={<FuncionarioDetalhePage/>}/>

                <Route path="/funcionarios/:id/editar" element={<EditarFuncionarioPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}