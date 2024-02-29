import { About } from "./About";

export function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
      <About />
    </>
  );
}
