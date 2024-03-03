import { createRoot } from "react-dom/client";

export const App = () => {
    return <h1>hello Bun</h1>
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);