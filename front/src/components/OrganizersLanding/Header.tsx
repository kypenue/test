"use client";

import { useState, useEffect } from "react";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { title: "Возможности", href: "#features" },
        { title: "Этапы турниров", href: "#stages" },
        { title: "Тарифы", href: "#pricing" },
        { title: "FAQ", href: "#faq" },
        { title: "Контакты", href: "#contact" },
    ];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Use useEffect for media queries
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkIfDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkIfDesktop();
        window.addEventListener("resize", checkIfDesktop);

        return () => window.removeEventListener("resize", checkIfDesktop);
    }, []);

    return (
        <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="CUPLY Logo"
                        width={120}
                        height={40}
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav
                    className={`desktop-nav ${isDesktop ? "desktop-nav--visible" : "desktop-nav--hidden"}`}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="nav-link"
                        >
                            {link.title}
                        </Link>
                    ))}
                    <Button
                        type="primary"
                        size="large"
                        className="btn-primary"
                        href="/auth"
                    >
                        Создать турнир
                    </Button>
                </nav>

                {/* Mobile Menu Button */}
                <Button
                    type="text"
                    className={`mobile-menu-button ${isDesktop ? "mobile-menu-button--hidden" : "mobile-menu-button--visible"}`}
                    onClick={toggleMobileMenu}
                    icon={<MenuOutlined className="mobile-menu-icon" />}
                />

                {/* Mobile Menu Drawer */}
                <Drawer
                    title={
                        <Image
                            src="/logo.svg"
                            alt="CUPLY Logo"
                            width={100}
                            height={32}
                        />
                    }
                    placement="right"
                    onClose={toggleMobileMenu}
                    open={mobileMenuOpen}
                    width={300}
                    className="mobile-menu-drawer"
                >
                    <div className="mobile-menu-content">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="nav-link mobile-nav-link"
                                onClick={toggleMobileMenu}
                            >
                                {link.title}
                            </Link>
                        ))}
                        <div className="mobile-cta-wrapper">
                            <Button
                                type="primary"
                                size="large"
                                className="btn-primary w-full"
                                href="/auth"
                                onClick={toggleMobileMenu}
                            >
                                Создать турнир
                            </Button>
                        </div>
                    </div>
                </Drawer>
            </div>
        </header>
    );
};

export default Header;
