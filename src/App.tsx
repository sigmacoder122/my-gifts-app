import React, { useState } from "react";
import ProfilePage from "./ProfilePage";
import MarketPage from "./MarketPage";
import PortfolioPage from "./PortfolioPage";
import GiftsStatsPage from "./GiftsStatsPage"; // 👈 добавили страницу статистики

type Page = "profile" | "market" | "portfolio" | "gifts-stats";

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>("profile");

    const renderPage = () => {
        switch (currentPage) {
            case "profile":
                return <ProfilePage />;
            case "market":
                return <MarketPage />;
            case "portfolio":
                return <PortfolioPage />;
            case "gifts-stats":
                return <GiftsStatsPage />;
            default:
                return <ProfilePage />;
        }
    };

    const pages: { key: Page; label: string }[] = [
        { key: "market", label: "Маркет" },
        { key: "portfolio", label: "Мой портфель" },
        { key: "gifts-stats", label: "Статистика подарков" }, // 👈 заменили Сезоны
        { key: "profile", label: "Профиль" },
    ];

    return (
        <div>
            {renderPage()}
            <div style={bottomNavStyle}>
                {pages.map((p) => (
                    <NavButton
                        key={p.key}
                        active={currentPage === p.key}
                        onClick={() => setCurrentPage(p.key)}
                    >
                        {p.label}
                    </NavButton>
                ))}
            </div>
        </div>
    );
};

// --- Стили ---

const bottomNavStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    padding: "12px 0",
    background: "linear-gradient(90deg, #1e1e1e, #2c2c2c)",
    borderTop: "2px solid #00aaff",
    zIndex: 100,
};

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

// Кнопка навигации
const NavButton: React.FC<NavButtonProps> = ({ active, children, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                margin: "0 6px",
                padding: "10px 0",
                borderRadius: 18,
                border: active ? "2px solid #00aaff" : "2px solid #555",
                background: active ? "#00aaff" : "#1e1e1e",
                color: active ? "#121212" : "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.25s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#005f99";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = active
                    ? "#00aaff"
                    : "#1e1e1e";
                (e.currentTarget as HTMLButtonElement).style.color = active ? "#121212" : "#fff";
            }}
        >
            {children}
        </button>
    );
};

export default App;
