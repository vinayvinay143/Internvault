import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="flex justify-center gap-4 sticky top-5 backdrop-blur mt-5 z-50">
      <nav className="flex justify-center p-3 px-2 border border-gray-200 rounded-full shadow-lg bg-white/80">
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="px-4 py-2 rounded-full hover:bg-[hsl(214.3_94.6%_92.7%)] hover:border border-[hsl(213.1_93.9%_67.8%)] transition duration-300">
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/internships"
              className="px-4 py-2 rounded-full hover:bg-[hsl(214.3_94.6%_92.7%)] hover:border border-[hsl(213.1_93.9%_67.8%)] transition duration-300"
            >
              Internships
            </Link>
          </li>

          <li>
            <Link
              to="/prompts"
              className="px-4 py-2 rounded-full hover:bg-[hsl(214.3_94.6%_92.7%)] hover:border border-[hsl(213.1_93.9%_67.8%)] transition duration-300"
            >
              Prompts
            </Link>
          </li>

          <li>
            <Link
              to="/skillvault"
              className="px-4 py-2 rounded-full bg-[hsl(211.7_96.4%_78.4%)] hover:border border-[hsl(213.1_93.9%_67.8%)] transition duration-300"
            >
              Skill Vault
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="flex justify-center p-3 px-2 border border-gray-200 rounded-full shadow-lg bg-white/80">
        <ul className="flex gap-4">
          <li>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-[hsl(211.7_96.4%_78.4%)] hover:border border-[hsl(213.1_93.9%_67.8%)] transition duration-300"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}