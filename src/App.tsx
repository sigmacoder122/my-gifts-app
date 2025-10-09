import React, { useState } from "react";
import ProfilePage from "./ProfilePage";
import MarketPage from "./MarketPage";
import PortfolioPage from "./PortfolioPage";
import GiftsStatsPage from "./GiftsStatsPage";
import LoadingScreen from "./LoadingScreen"; // Лоадинг экран
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Home, PieChart, ShoppingBag, User } from "lucide-react";

type Page = "profile" | "market" | "portfolio" | "gifts-stats";

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>("profile");
    const [loading, setLoading] = useState(true);

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

    const pages: { key: Page; label: string; icon: React.ReactNode }[] = [
        { key: "market", label: "Маркет", icon: <ShoppingBag size={24} /> },
        { key: "portfolio", label: "Портфель", icon: <Home size={24} /> },
        { key: "gifts-stats", label: "Статистика", icon: <PieChart size={24} /> },
        { key: "profile", label: "Профиль", icon: <User size={24} /> },
    ];

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    return (
        <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
            <div style={{ paddingBottom: 80 }}>
                {renderPage()}

                {/* Нижняя навигация */}
                <nav style={bottomNavStyle}>
                    {pages.map((p) => (
                        <NavButton
                            key={p.key}
                            active={currentPage === p.key}
                            onClick={() => setCurrentPage(p.key)}
                            icon={p.icon}
                            label={p.label}
                        />
                    ))}
                </nav>
            </div>
        </TonConnectUIProvider>
    );
};

// --- Стили нижней панели ---
const bottomNavStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 70,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "#121212",
    borderTop: "1px solid #333",
    zIndex: 100,
};

// --- Кнопка с иконкой и подписью ---
interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                color: active ? "#00aaff" : "#888",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                gap: 4,
                transition: "color 0.2s ease",
            }}
        >
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: active ? "rgba(0,170,255,0.15)" : "transparent",
                    transition: "background 0.2s ease",
                }}
            >
                {icon}
            </div>
            <span>{label}</span>
        </button>
    );
};

export default App;
