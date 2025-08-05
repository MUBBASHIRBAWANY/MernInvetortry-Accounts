import React, { useEffect, useState } from 'react'
import SIdebar from './Components/Sidebar/SIdebar.jsx'
import { Route, Routes } from 'react-router-dom'
import OpensideBar from './Components/Sidebar/OpensideBar.jsx'
import Header from './Components/Headers/Header.jsx'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import routes from './utils/routes.jsx'
import Login from './Components/Users/Login/Login.jsx'

const App = () => {
  const login = useSelector((state) => state.LoginerReducer.state)
  const SidebarOpen = useSelector((state) => state.isSideBar.state)
  console.log(login)
    useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        const formElements = Array.from(document.querySelectorAll('input, select, textarea, button, [tabindex]:not([tabindex="-1"])'))
          .filter(el => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null); // only visible and focusable

        const index = formElements.indexOf(document.activeElement);

        if (index > -1 && index < formElements.length - 1) {
          event.preventDefault(); // prevent default Enter behavior
          formElements[index + 1].focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div>
      {!login ? <Login /> : (
        <div>
          <div>
            <div className="flex  h-screen bg-gray-100">
              {/* Sidebar */}
              <div
                className={`h-full w-64 fixed bg-gray-900 z-50 ${SidebarOpen ? 'fixed block' : 'hidden'
                  } lg:static lg:block`}
              >
                <div className='fixed'>
                  <SIdebar />
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                <Header />
                <Routes>
                  {routes.map((item) => (
                    <Route key={item.path} path={item.path} element={item.component} />
                  ))}
                </Routes>
              </div>
              <OpensideBar />
            </div>
          </div>

        </div>
      )}



    </div>
  )
}

export default App