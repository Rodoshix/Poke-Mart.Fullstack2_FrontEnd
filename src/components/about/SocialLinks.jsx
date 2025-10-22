// usado por NosotrosPage.jsx
// src/components/about/SocialLinks.jsx
const DEFAULT_LINKS = [
  { href: "https://www.facebook.com/",  label: "Facebook"  },
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://twitter.com/",       label: "Twitter"   },
  { href: "https://www.linkedin.com/",  label: "LinkedIn"  },
];

export default function SocialLinks({ links = DEFAULT_LINKS }) {
  return (
    <aside className="about-social">
      <div className="about-social__card">
        <h3 className="about-social__heading h4 mb-3">Síguenos</h3>
        <ul className="about-social__list">
          {links.map((l) => (
            <li key={l.href}>
              <a
                className="about-social__link"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="about-social__icon" aria-hidden="true"></span>
                <span>{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
