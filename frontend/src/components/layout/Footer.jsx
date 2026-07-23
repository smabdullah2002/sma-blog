import { Link } from "react-router-dom";
import Container from "./Container";



export default function Footer() {

  const socialLinks = [
    {
      name: "Twitter",
      url: "https://x.com/SheikhMuha23559",
    },
    {
      name: "GitHub",
      url: "https://github.com/smabdullah2002",
    },
    {
      name: "Gmail",
      url: "mailto:sheikhmuhammad2002@gmail.com",
    },
  ];

  const sections = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Archive",
      url: "/archive",
    }
  ];
  return (
    <footer>
      {/* Inverted Section */}
      <div className="bg-ink text-bg border-t-4 border-ink">
        <Container className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="font-serif text-3xl font-black tracking-tighter mb-4">
                SMA Blog
              </h3>

            </div>
            <div className="md:col-span-2">
              <h4 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-4">
                Sections
              </h4>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.name}>
                    <Link to={section.url} className="font-sans text-sm text-bg hover:text-accent transition-colors duration-200">
                      {section.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-4">
                Connect
              </h4>
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.url} className="font-sans text-sm text-bg hover:text-accent transition-colors duration-200">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-4">
              <h4 className="font-sans text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-4">
                Get the Newsletter
              </h4>
              <div className="flex border border-bg">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent px-3 py-2 font-mono text-sm text-bg placeholder:text-neutral-500 focus-visible:bg-neutral-600 focus-visible:outline-none"
                />
                <button className="bg-bg text-ink px-4 py-2 font-sans text-xs uppercase tracking-widest font-semibold hover:bg-neutral-100 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ink bg-bg">
        <Container className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            Edition: Vol 1.0 | Printed in Dhaka
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            &copy; {new Date().getFullYear()} SMA Blog. All rights reserved.
          </span>
        </Container>
      </div>
    </footer>
  );
}
