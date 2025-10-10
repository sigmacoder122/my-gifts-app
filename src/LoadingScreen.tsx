import React, { useEffect, useRef, useState } from "react";

/**
 * LoadingScreenSuperLuxe.tsx
 * "Супер-люкс" загрузочный экран — большой, богатый анимациями и полностью на TypeScript + React.
 *
 * Особенности:
 * - Параллакс частицы с физикой движения
 * - Градиентное неоновое освещение и «aurora» волны
 * - Ротация логотипа с шейдингом и мерцанием
 * - Продвинутый прогресс-бар с easing и детализированным процентом
 * - Мелкие декоративные элементы: искры, рельефные кольца, шум
 * - Полная кастомизация через пропсы (логотипы, цвета, длительность)
 *
 * Как использовать:
 * <LoadingScreen onComplete={() => setShow(false)} />
 * или передать mainLogoUrl/particleUrl/primaryColor и т.д.
 *
 * Автор: ChatGPT (адаптируй по вкусу)
 */

type Particle = {
    id: string;
    x: number; // смещение от центра в px
    y: number; // смещение от центра в px
    vx: number; // скорость по x
    vy: number; // скорость по y
    scale: number;
    rotation: number;
    rotationSpeed: number;
    life: number; // 0..1
    size: number;
    hue: number;
};

type LoadingScreenProps = {
    onComplete: () => void;
    mainLogoUrl?: string; // если не задан — используется встроенный SVG логотип
    particleUrl?: string | null; // если null — будет использована цветная точка
    primaryColor?: string; // основной акцент
    accentColor?: string; // вторичный акцент
    durationMs?: number; // ожидаемая средняя длительность загрузки
};

const DEFAULT_DURATION = 3500; // ms — средняя симуляция загрузки

// Утилита для генерации случайного id
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

// Небольшая функция easing (easeOutCubic)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Default inline SVG логотип (если у пользователя нет логотипа)
const DefaultLogoSVG = ({ size = 140 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Logo"
    >
        <defs>
            <linearGradient id="lg1" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#00c2ff" />
                <stop offset="100%" stopColor="#7a00ff" />
            </linearGradient>
            <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#f1)">
            <circle cx="100" cy="100" r="46" fill="url(#lg1)" />
            <path
                d="M70 110 C85 140, 115 140, 130 110"
                stroke="#fff"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                opacity="0.95"
            />
        </g>
        <g>
            <circle cx="100" cy="100" r="34" fill="#0f0f10" opacity="0.08" />
        </g>
    </svg>
);

// Компонент одной частицы (отвечает за рендер — простой sprite или изображение)
function ParticleSprite({ p, particleUrl }: { p: Particle; particleUrl?: string | null }) {
    const style: React.CSSProperties = {
        position: "absolute",
        left: `calc(50% + ${p.x}px)`,
        top: `calc(50% + ${p.y}px)`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`,
        pointerEvents: "none",
        filter: `drop-shadow(0 6px 18px hsla(${p.hue}, 80%, 50%, 0.12))`,
        mixBlendMode: "screen",
    };

    if (particleUrl) {
        return <img src={particleUrl} style={style} alt="particle" />;
    }

    // fallback: gradient dot
    return (
        <div
            aria-hidden
            style={{
                ...style,
                borderRadius: "999px",
                background: `conic-gradient(from 180deg at 50% 50%, hsla(${p.hue},90%,60%,0.95), hsla(${(p.hue + 60) % 360},90%,60%,0.9))`,
                boxShadow: `0 6px 20px hsla(${p.hue},80%,50%,0.18), inset 0 -2px 10px hsla(${p.hue},90%,30%,0.2)`,
            }}
        />
    );
}

// Главный компонент
export default function LoadingScreen({
                                          onComplete,
                                          mainLogoUrl,
                                          particleUrl = null,
                                          primaryColor = "#00c2ff",
                                          accentColor = "#7a00ff",
                                          durationMs = DEFAULT_DURATION,
                                      }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState<Particle[]>([]);
    const rafRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [logoRotation, setLogoRotation] = useState(0);
    const [sparkles, setSparkles] = useState(() => {
        // sparkles are simple decorative transient elements
        return new Array(6).fill(0).map(() => ({ id: uid("s") }));
    });

    // Инициализация массива частиц — сделаем побольше и медленнее
    useEffect(() => {
        const temp: Particle[] = [];
        const total = 42; // достаточно много для "люкса"
        for (let i = 0; i < total; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 28 + Math.random() * 220;
            const speed = 0.08 + Math.random() * 0.6; // базовая скорость
            const hue = Math.floor(Math.random() * 60) + 180; // синий-фиолетовая гамма
            temp.push({
                id: uid("p"),
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                vx: Math.cos(angle) * speed * (Math.random() * 0.6 + 0.6),
                vy: Math.sin(angle) * speed * (Math.random() * 0.6 + 0.6),
                scale: 0.7 + Math.random() * 1.2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 0.6,
                life: Math.random(),
                size: 8 + Math.random() * 32,
                hue,
            });
        }
        setParticles(temp);
    }, []);

    // requestAnimationFrame loop — плавное изменение частиц и прогресса
    useEffect(() => {
        let last = performance.now();
        startTimeRef.current = performance.now();

        const tick = (now: number) => {
            const dt = Math.min(40, now - last);
            last = now;

            // update logo rotation — медленный ротационный эффект
            setLogoRotation((r) => (r + dt * 0.02) % 360);

            // animate particles physics
            setParticles((prev) => {
                const next = prev.map((p) => {
                    // небольшое притяжение к центру, чтобы частицы не улетали слишком далеко
                    const ax = -p.x * 0.0004;
                    const ay = -p.y * 0.0004;
                    let vx = p.vx + ax * dt;
                    let vy = p.vy + ay * dt;
                    // небольшая фрикция
                    vx *= 0.9995;
                    vy *= 0.9995;
                    let x = p.x + vx * dt * 0.06;
                    let y = p.y + vy * dt * 0.06;
                    const rotation = (p.rotation + p.rotationSpeed * (dt * 0.06)) % 360;
                    const life = Math.max(0, Math.min(1, p.life + (Math.random() - 0.46) * 0.002));
                    return { ...p, x, y, vx, vy, rotation, life };
                });
                return next;
            });

            // прогресс — симуляция с easing
            setProgress((prev) => {
                const elapsed = now - (startTimeRef.current || now);
                const t = Math.min(1, elapsed / durationMs);
                const target = Math.floor(easeOutCubic(t) * 100);
                if (target >= 100) return 100;
                // случайные микроскачки
                const jitter = Math.random() * 0.7;
                return Math.min(100, Math.max(prev, target + jitter));
            });

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [durationMs]);

    // Когда прогресс дошёл до 100 — вызываем onComplete через небольшую паузу
    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(() => {
                onComplete();
            }, 420);
            return () => clearTimeout(timeout);
        }
    }, [progress, onComplete]);

    // небольшая утилита для вспышек-искорок вокруг логотипа
    const spawnSpark = () => {
        setSparkles((s) => [...s, { id: uid("sp") }].slice(-12));
    };

    // параллакс эффекта мыши (для десктопа)
    useEffect(() => {
        const w = wrapperRef.current;
        if (!w) return;
        const onMove = (e: MouseEvent) => {
            const rect = w.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / rect.width;
            const dy = (e.clientY - cy) / rect.height;
            // используем эти значения чтобы легко влиять на частицы
            setParticles((prev) => prev.map((p) => ({ ...p, vx: p.vx + dx * 0.002, vy: p.vy + dy * 0.002 })));
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    // стилизованный формат процентов (целые)
    const displayPct = Math.min(100, Math.max(0, Math.round(progress)));

    // large decorative rings — рендерим SVG элементы позади логотипа
    const DecorativeRings = () => (
        <svg
            width="840"
            height="840"
            viewBox="0 0 840 840"
            className="pointer-events-none absolute -z-10 opacity-60"
            aria-hidden
        >
            <defs>
                <radialGradient id="rgA" cx="50%" cy="50%">
                    <stop offset="0%" stopColor={primaryColor} stopOpacity="0.12" />
                    <stop offset="50%" stopColor={accentColor} stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.0" />
                </radialGradient>
                <filter id="blurTiny">
                    <feGaussianBlur stdDeviation="18" />
                </filter>
            </defs>

            <g transform="translate(420,420)">
                <circle r="240" fill="url(#rgA)" filter="url(#blurTiny)" />
                <g style={{ mixBlendMode: "screen" }}>
                    <circle r="160" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.25" />
                    <circle r="220" stroke={primaryColor} strokeWidth="1.5" fill="none" opacity="0.08" />
                </g>
                <g transform="rotate(23)">
                    <ellipse rx="280" ry="32" fill={primaryColor} opacity="0.02" />
                </g>
            </g>
        </svg>
    );

    return (
        <div
            ref={wrapperRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#07070a]"
            aria-live="polite"
        >
            {/* фон с мягкой градиентной aurora */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]" style={{
                    background: `radial-gradient(1200px 600px at 10% 20%, ${primaryColor}22, transparent 10%), radial-gradient(900px 400px at 90% 80%, ${accentColor}18, transparent 8%), linear-gradient(180deg,#050508 10%, rgba(10,10,12,0.8) 60%)`
                }} />

                {/* мягкие волны aurora */}
                <div className="absolute inset-0 -z-10" aria-hidden>
                    <svg width="1600" height="900" viewBox="0 0 1600 900" className="w-full h-full">
                        <defs>
                            <linearGradient id="waveG" x1="0" x2="1">
                                <stop offset="0" stopColor={primaryColor} stopOpacity="0.18" />
                                <stop offset="1" stopColor={accentColor} stopOpacity="0.08" />
                            </linearGradient>
                            <filter id="gBlur">
                                <feGaussianBlur stdDeviation="30" />
                            </filter>
                        </defs>
                        <g filter="url(#gBlur)">
                            <path d="M0,240 C260,50 500,420 800,270 C1100,120 1400,420 1600,300 L1600 900 L0 900 Z" fill="url(#waveG)" opacity="0.65" />
                            <path d="M0,360 C420,200 700,500 1000,360 C1300,220 1500,560 1600,420 L1600 900 L0 900 Z" fill="url(#waveG)" opacity="0.35" />
                        </g>
                    </svg>
                </div>

                {/* декоративные кольца */}
                <DecorativeRings />

                {/* шум поверха — тонкий grain */}
                <div className="absolute inset-0 -z-5" style={{ mixBlendMode: "overlay", opacity: 0.035 }}>
                    <svg width="100%" height="100%">
                        <filter id="noise">
                            <feTurbulence baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                            <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noise)" />
                    </svg>
                </div>
            </div>

            {/* контейнер контента */}
            <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[980px] px-6">
                {/* Область частиц (на всю ширину) */}
                <div className="absolute inset-0 pointer-events-none">
                    {particles.map((p) => (
                        <ParticleSprite key={p.id} p={p} particleUrl={particleUrl} />
                    ))}
                </div>

                {/* Фокус: логотип + подсветка */}
                <div
                    className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-3xl"
                    aria-hidden={false}
                >
                    {/* Glow frame */}
                    <div
                        className="absolute -inset-4 rounded-3xl opacity-80"
                        style={{
                            background: `linear-gradient(120deg, ${primaryColor}22, transparent 20%, ${accentColor}12)`,
                            filter: "blur(30px)",
                            transform: "translateZ(0)",
                        }}
                    />

                    {/* Frosted glass card */}
                    <div
                        className="relative z-10 flex flex-col items-center gap-4 rounded-2xl p-6 backdrop-blur-md"
                        style={{
                            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                            boxShadow: "0 30px 60px rgba(3,6,13,0.6), inset 0 -1px 0 rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.03)",
                        }}
                    >
                        <div className="relative flex items-center justify-center w-[180px] h-[180px]">
                            {/* вращающийся мерцающий диск */}
                            <div
                                aria-hidden
                                className="absolute -z-10 rounded-full"
                                style={{
                                    width: 280,
                                    height: 280,
                                    background: `conic-gradient(from ${logoRotation}deg, ${primaryColor}, ${accentColor}, ${primaryColor})`,
                                    opacity: 0.07,
                                    filter: "blur(40px)",
                                    transform: `scale(${1 + Math.sin(logoRotation / 40) * 0.02})`,
                                }}
                            />

                            {/* рельефный ring */}
                            <div
                                aria-hidden
                                className="absolute rounded-full"
                                style={{
                                    width: 210,
                                    height: 210,
                                    borderRadius: 9999,
                                    border: `1px solid rgba(255,255,255,0.03)`,
                                    boxShadow: `inset 0 8px 30px rgba(0,0,0,0.6)`,
                                }}
                            />

                            {/* Logo */}
                            <div
                                className="relative w-[140px] h-[140px] flex items-center justify-center rounded-full"
                                style={{
                                    transform: `rotate(${logoRotation}deg)`,
                                    transition: "transform 160ms linear",
                                }}
                            >
                                {mainLogoUrl ? (
                                    <img
                                        src={mainLogoUrl}
                                        alt="Main Logo"
                                        style={{ width: 140, height: 140, objectFit: "contain" }}
                                    />
                                ) : (
                                    <DefaultLogoSVG size={140} />
                                )}
                            </div>

                            {/* маленькие sparkles */}
                            <div className="absolute bottom-0 right-0 translate-x-6 translate-y-8 pointer-events-none">
                                {sparkles.map((s, i) => (
                                    <span
                                        key={s.id}
                                        style={{
                                            display: "block",
                                            width: 6 + (i % 3) * 4,
                                            height: 6 + (i % 3) * 4,
                                            margin: 4,
                                            borderRadius: 9999,
                                            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.15) 30%, transparent 60%)`,
                                            opacity: 0.9 - (i * 0.05),
                                            transform: `translateY(${-(i * 4)}px) scale(${1 - i * 0.03})`,
                                            filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.35))`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Подпись и слоган */}
                        <div className="text-center mt-1">
                            <div className="text-[18px] font-semibold text-white/95">Добро пожаловать</div>
                            <div className="text-xs text-white/40 mt-1">Подготовка супер-люкс интерфейса...</div>
                        </div>

                        {/* Динамический прогресс */}
                        <div className="mt-4 w-[520px] max-w-full">
                            <div className="relative h-4 rounded-full overflow-hidden bg-white/6">
                                <div
                                    aria-hidden
                                    className="absolute inset-0"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${accentColor}44 20%, ${primaryColor}66 60%, transparent 100%)`,
                                        opacity: progress > 2 ? 1 : 0.6,
                                        filter: "blur(8px)",
                                        transform: `translateX(${Math.max(-26, -26 + (progress / 100) * 26)}px)`,
                                        transition: "transform 420ms cubic-bezier(.22,.9,.32,1)",
                                    }}
                                />
                                <div
                                    className="relative h-full rounded-full transition-all"
                                    style={{
                                        width: `${displayPct}%`,
                                        background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                                        boxShadow: `0 6px 26px ${primaryColor}30, inset 0 -2px 8px rgba(255,255,255,0.05)`,
                                        transition: "width 260ms cubic-bezier(.22,.9,.32,1), box-shadow 260ms",
                                    }}
                                />

                                {/* overlay shimmer */}
                                <div
                                    aria-hidden
                                    className="absolute top-0 left-0 h-full w-full"
                                    style={{
                                        background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 55%)`,
                                        transform: `translateX(${(performance.now() % 1200) / 6 - 200}%)`,
                                        mixBlendMode: "overlay",
                                        opacity: 0.6,
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>

                            {/* Процент + мини-детали */}
                            <div className="flex items-center justify-between mt-3 text-xs">
                                <div className="text-[13px] text-white/70">Загружаем ресурсы</div>
                                <div className="text-[13px] font-semibold text-white">{displayPct}%</div>
                            </div>

                            {/* Набор статусов (анимированный список) */}
                            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-white/40">
                                <StatusItem label="Инициализация" active={displayPct > 8} />
                                <StatusItem label="Кэш компонентов" active={displayPct > 22} />
                                <StatusItem label="Шейдеры готовы" active={displayPct > 40} />
                                <StatusItem label="Сервисы онлайн" active={displayPct > 58} />
                                <StatusItem label="Подгрузка UI" active={displayPct > 76} />
                                <StatusItem label="Финализация" active={displayPct > 94} />
                            </div>
                        </div>

                        {/* маленькая кнопка для демонстрации (не кликабельна) */}
                        <div className="mt-4">
                            <button
                                className="px-4 py-2 rounded-full text-sm font-medium bg-white/6 text-white/80"
                                onClick={(e) => {
                                    e.preventDefault();
                                    spawnSpark();
                                }}
                            >
                                Микро-эффекты
                            </button>
                        </div>
                    </div>
                </div>

                {/* Подпись внизу (мелкое) */}
                <div className="text-[12px] text-white/30 mt-6">© UI Suite — Подождите, это будет красиво ✨</div>
            </div>

            {/* CSS keyframes & helper styles — используем <style> внутри файла для независимости */}
            <style>{`
        /* Пространство для длинных анимаций и нюансов — оставлено явным для полного контроля */

        @keyframes pulseGlow {
          0% { opacity: .06; transform: scale(1); }
          50% { opacity: .14; transform: scale(1.02); }
          100% { opacity: .06; transform: scale(1); }
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(.9); opacity: 1; }
          100% { transform: translateY(-42px) scale(.7); opacity: 0; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes tinySparkle {
          0% { transform: scale(.6) translateY(0); opacity: .0 }
          40% { opacity: 1; transform: scale(1.05) translateY(-6px) }
          100% { opacity: 0; transform: scale(.8) translateY(-22px) }
        }

        /* responsive tweaks */
        @media (max-width: 720px) {
          .max-w-\[980px\] { max-width: 98% !important; }
        }
      `}</style>
        </div>
    );
}

// Небольшая презентативная карточка статуса — отдельно, чтобы код был явным
function StatusItem({ label, active }: { label: string; active: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <div
                aria-hidden
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    background: active ? "linear-gradient(180deg,#fff,#fff)" : "rgba(255,255,255,0.06)",
                    boxShadow: active ? "0 6px 18px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.08)" : "none",
                    transition: "all 260ms",
                }}
            />
            <div style={{ opacity: active ? 1 : 0.5, transition: "opacity 260ms" }}>{label}</div>
        </div>
    );
}

// =====================
// Примечания и идеи для дальнейшей кастомизации (можно вставить в README):
// - Подключить реальные изображения логотипов через mainLogoUrl
// - Добавить выключаемую опцию "reduceMotion" для пользователей с ограничениями
// - Перевести мельчайшие анимации в Tailwind config (custom keyframes) при сборке
// - Сделать вариант на styled-components (если в проекте используется он)
// - Поддержка тем "dark"/"light" (текущая реализация ориентирована на dark)
// =====================
