import { RouterProvider, createMemoryRouter } from "react-router-dom";

import Links from "./Links";
import Settings from "./Settings";

function App() {
  const routes = [
    {
      path: "/",
      element: <Links />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
  ];

  const router = createMemoryRouter(routes);

  return (
    <div className="w-[500px] p-2">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
