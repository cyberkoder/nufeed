import { FC } from "react";

interface FooterLink {
    href: string;
    text: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

const footerSections: FooterSection[] = [
    {
        title: "About NuFeed",
        links: [
            { href: "/about", text: "About Us" },
            { href: "/careers", text: "Careers" },
            { href: "/press", text: "Press" },
            { href: "/contact", text: "Contact" },
        ],
    },
    {
        title: "Support",
        links: [
            { href: "/help", text: "Help Center" },
            { href: "/community", text: "Community Guidelines" },
            { href: "/faq", text: "FAQ" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: "/privacy", text: "Privacy Policy" },
            { href: "/terms", text: "Terms of Service" },
            { href: "/cookies", text: "Cookie Policy" },
        ],
    },
];

const socialLinks = [
    { href: "https://twitter.com", text: "𝕏 (Twitter)", label: "X (Twitter)" },
    { href: "https://facebook.com", text: "Facebook", label: "Facebook" },
    { href: "https://instagram.com", text: "Instagram", label: "Instagram" },
];

const Footer: FC = () => {
    return (
        <footer className="text-zinc-700 py-8 mt-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-bold text-lg mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="hover:text-gray-300"
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h3 className="font-bold text-lg mb-4">Connect</h3>
                        <div className="flex flex-col space-x-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="hover:text-gray-300"
                                >
                                    <span className="sr-only">
                                        {link.label}
                                    </span>
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-700 p-4">
                    <p>
                        © {new Date().getFullYear()} NuFeed. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
