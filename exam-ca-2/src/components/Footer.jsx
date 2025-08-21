import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-[rgba(10,10,10,0.8)] backdrop-blur-lg text-white py-6 mt-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">
            Holi<span className="text-yellow-400">daze</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            &copy; {new Date().getFullYear()} Holidaze. All rights reserved.
          </p>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://facebook.com"
            className="text-gray-400 hover:text-yellow-400 transition"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a
            href="https://www.instagram.com"
            className="text-gray-400 hover:text-yellow-400 transition"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a
            href="https://twitter.com"
            className="text-gray-400 hover:text-yellow-400 transition"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
}
