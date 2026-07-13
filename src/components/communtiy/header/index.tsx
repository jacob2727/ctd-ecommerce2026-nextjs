import { Link } from "lucide-react";

const CommunityHeader = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/community" className="hover:underline">
              Community Home
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default CommunityHeader;
