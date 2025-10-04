export interface Gift {
    id: number;
    name: string;
    price: number; // в TON
    growth: number; // рост за неделю в %
    img: string; // ссылка на изображение
}

// Массив подарков
export const gifts: Gift[] = [
    {
        id: 1,
        name: "Push pepe",
        price: 3450,
        growth: 5,
        img: "https://cdn.changes.tg/gifts/models/Plush%20Pepe/png/Original.png"
    },
    {
        id: 2,
        name: "Durov cap",
        price: 2322,
        growth: 10,
        img: "https://cdn.changes.tg/gifts/models/Durov%27s%20Cap/png/Original.png"
    },
    {
        id: 3,
        name: "Signet ring",
        price: 20,
        growth: 8,
        img: "https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/signetring/Rose%20Gold.webp"
    },
    {
        id: 4,
        name: "Snoop sigare",
        price: 25,
        growth: 12,
        img: "https://storage.beee.pro/game_items/39238/NTtmBjZ3yUxIToDTrHFLseN2YaJKWWgXPj32B1V6.webp"
    },
    {
        id: 5,
        name: "Genie lamp",
        price: 30,
        growth: 7,
        img: "https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/genielamp/Lightning.webp"
    },
    {
        id: 6,
        name: "Scared cat",
        price: 18,
        growth: 15,
        img: "https://podarki-tg.com/wp-content/uploads/2025/06/image-863.png"
    },
];

// Лого TON
export const tonLogo = "https://ton.org/download/ton_symbol.png";

// Пустой экспорт для корректного модуля
export {};
