import { BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Categories from './pages/dashboard/Categories';
import Customers from './pages/dashboard/Customers';
import Products from './pages/dashboard/Products';
import Sales from './pages/dashboard/Sales';

import './App.css'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path='categories' element={<Categories />} />
          <Route path='customers' element={<Customers />} />
          <Route path='products' element={<Products />} />
          <Route path='sales' element={<Sales />} />
         
        </Route>
      </Routes>
    </BrowserRouter>
  );}

export default App;
