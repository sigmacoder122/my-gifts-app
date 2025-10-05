// src/data/gifts.ts
export interface Gift {
    id: number;
    name: string;
    price: number;
    growth: number;
    img: string;
    invested?: number; // 💰 Добавлено: сумма инвестиций
}

export const gifts: Gift[] = [
    {
        id: 1,
        name: "Push Pepe",
        price: 3450,
        growth: 5,
        img: "https://cdn.changes.tg/gifts/models/Plush%20Pepe/png/Original.png",
        invested: 0,
    },
    {
        id: 2,
        name: "Durov Cap",
        price: 2322,
        growth: 10,
        img: "https://cdn.changes.tg/gifts/models/Durov%27s%20Cap/png/Original.png",
        invested: 0,
    },
    {
        id: 3,
        name: "Signet Ring",
        price: 20,
        growth: 8,
        img: "https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/signetring/Rose%20Gold.webp",
        invested: 0,
    },
    {
        id: 4,
        name: "Snoop Sigare",
        price: 25,
        growth: 12,
        img: "https://storage.beee.pro/game_items/39238/NTtmBjZ3yUxIToDTrHFLseN2YaJKWWgXPj32B1V6.webp",
        invested: 0,
    },
    {
        id: 5,
        name: "Genie Lamp",
        price: 30,
        growth: 7,
        img: "https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/genielamp/Lightning.webp",
        invested: 0,
    },
    {
        id: 6,
        name: "Scared Cat",
        price: 18,
        growth: 15,
        img: "https://podarki-tg.com/wp-content/uploads/2025/06/image-863.png",
        invested: 0,
    },
];

export const tonLogo = "https://ton.org/download/ton_symbol.png";
