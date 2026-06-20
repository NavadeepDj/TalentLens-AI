import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <div className="bg-mesh" />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
