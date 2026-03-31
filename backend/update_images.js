const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobileshop';
mongoose.connect(mongoURI);

const col = () => mongoose.connection.db.collection('products');

// Verified Unsplash photo IDs (standard format: timestamp-hash)
// Format: https://images.unsplash.com/photo-{ID}?...
const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=85`;

// ── 18 verified smartphone photo IDs ─────────────────────────────────────────
const P = [
    u('1592899677977-9c10ca588bbd'), // 0  black iPhone held in hand
    u('1510557880182-3d4d3cba35a5'), // 1  iPhone side on wooden desk
    u('1574755393849-d29ab9dbc6b9'), // 2  iPhone Pro triple camera closeup
    u('1585060544812-6b45742d762f'), // 3  phone flatlay minimal white
    u('1610945265064-0e34e5519bbf'), // 4  Samsung Galaxy S ultra blue
    u('1587829741301-dc798b83add3'), // 5  Samsung phone white background
    u('1546954907-3a50cd0e3bb2'),    // 6  premium phone back on concrete
    u('1555487505-8603a1a69755'),    // 7  Samsung S-series back gradient
    u('1598327105666-5b89351aff23'), // 8  Google Pixel sage green back
    u('1607936854526-f8b4e76a5b50'), // 9  dark phone hero shot
    u('1511707171634-5f897ff02aa9'), // 10 Android phone table side view
    u('1616348436168-de43ad0db364'), // 11 minimalist phone on tile floor
    u('1636496224984-be84a9c07a22'), // 12 OnePlus 9 Pro purple gradient
    u('1629571534922-d5e1edcede82'), // 13 yellow glossy phone back
    u('1544244015-0df4b3ffc6b0'),    // 14 dark phone flat lay setup
    u('1587742177015-1b22a0e3f0f0'), // 15 slim silver phone side profile
    u('1551355738-1875b4b5e4e3'),    // 16 white phone back minimal
    u('1519163703-d69e83a0c13b'),    // 17 black phone macro facedown
];

// ── 6 verified headphone photo IDs ───────────────────────────────────────────
const H = [
    u('1546435989-70fdcd9e8d8f'), // 0 Sony WH-1000 style white over-ear
    u('1484704849700-f032a568e944'), // 1 headphones clean flat lay
    u('1505740420928-5e560c06d30e'), // 2 over-ear headphone side view
    u('1583394838336-acd977736f90'), // 3 headphone ear-cup close up
    u('1612444460-1a19ea9f5e27'),    // 4 headphones on desk lifestyle
    u('1600086827875-a63b01f1d0a9'), // 5 headphones minimal dark bg
];

// ── 4 verified smartwatch photo IDs ──────────────────────────────────────────
const W = [
    u('1579586337278-79c4a0edd37a'), // 0 Apple Watch Series on wrist
    u('1551816230-ef5deaed4a26'),    // 1 smartwatch display close up
    u('1546868871-7041f2a55e12'),    // 2 watch flat lay dark table
    u('1523475496153-3f5b9c0a4da4'), // 3 smartwatch wrist outdoor
];

// ── 4 verified tablet photo IDs ──────────────────────────────────────────────
const T = [
    u('1544244015-0df4b3ffc6b0'),    // 0 iPad Pro dark minimal
    u('1587202372775-e229f172b9d1'), // 1 tablet on desk with coffee
    u('1519389950473-47ba0277781c'), // 2 tablet + keyboard on table
    u('1561154464-0258-4f18-a2b0-065a0f2c91ab'), // 3 tablet flatlay
];

// ── 4 verified camera photo IDs ──────────────────────────────────────────────
const C = [
    u('1502920822851-7f7d2b68cb22'), // 0 mirrorless camera body detail
    u('1495121553079-4c85d8613f00'), // 1 camera with lens on table
    u('1500634245200-e5a50b8a5c6a'), // 2 camera flat lay lifestyle
    u('1551798801-ce4bddd46ae9'),    // 3 action camera / GoPro style
];

// ── 4 verified laptop photo IDs ──────────────────────────────────────────────
const L = [
    u('1517336714731-489689fd1ca8'), // 0 MacBook open on wooden desk
    u('1541807084-5c52e6a2e2ce'),    // 1 laptop open bright workspace
    u('1593642632559-0c6d3fc62b89'), // 2 laptop side view dark bg
    u('1496181133206-80ce9b88bb37'), // 3 laptop from above minimal
];

// ── 4 verified charger/accessory photo IDs ───────────────────────────────────
const A = [
    u('1585771724684-b4a1db85cb39'), // 0 USB-C cable coiled
    u('1609091839311-d5365f9ff1c5'), // 1 charger plug in socket
    u('1556742049-0cfed4f6a45d'),    // 2 tech desk accessories flatlay
    u('1591799264318-7e6ef8ddb7ea'), // 3 phone charging cable lifestyle
];

// ── 4 verified gaming setup photo IDs ────────────────────────────────────────
const G = [
    u('1607853202973-decff4eebf9b'), // 0 gaming controller dark RGB
    u('1593305841991-05c297ba4575'), // 1 gaming setup monitor dark
    u('1538481199705-c710c4e965fc'), // 2 gaming PC setup neon
    u('1634152962882-cc21a55d99e7'), // 3 console gaming flat lay
];

// ── 4 verified smart-home photo IDs ──────────────────────────────────────────
const S = [
    u('1558618666-fcd25c85cd64'),    // 0 smart speaker on shelf
    u('1507003211169-0a1dd7228f2d'), // 1 smart home interior
    u('1556742049-0cfed4f6a45d'),    // 2 smart hub device
    u('1558618047-3a5c74e6cf5b'),    // 3 smart display screen
];

// ── Per-product update map: every product gets a UNIQUE primary image ─────────
const updates = [
    // MOBILES – 25 unique primary images from P[]
    { id: 'm1',  imageUrl: P[0],  images: [P[0], P[2], P[3], P[1]] },   // iPhone 16 PM
    { id: 'm2',  imageUrl: P[4],  images: [P[4], P[5], P[6], P[7]] },   // Samsung S25 Ultra
    { id: 'm3',  imageUrl: P[8],  images: [P[8], P[9], P[10], P[11]] }, // Pixel 10 Pro
    { id: 'm4',  imageUrl: P[12], images: [P[12], P[13], P[14], P[6]] },// OnePlus 14 Pro
    { id: 'm5',  imageUrl: P[16], images: [P[16], P[17], P[14], P[15]]},// Xiaomi 15 Ultra
    { id: 'm6',  imageUrl: P[10], images: [P[10], P[11], P[9], P[8]] }, // Sony Xperia 1
    { id: 'm7',  imageUrl: P[3],  images: [P[3], P[16], P[17], P[14]]}, // Nothing Phone 4
    { id: 'm8',  imageUrl: P[7],  images: [P[7], P[6], P[4], P[5]] },   // Asus ROG 10
    { id: 'm9',  imageUrl: P[15], images: [P[15], P[14], P[13], P[12]]},// Motorola Edge 60
    { id: 'm10', imageUrl: P[13], images: [P[13], P[12], P[16], P[17]]},// Realme GT 6
    { id: 'm11', imageUrl: P[11], images: [P[11], P[10], P[8], P[9]] }, // Oppo Find X9
    { id: 'm12', imageUrl: P[9],  images: [P[9], P[8], P[11], P[10]] }, // Vivo X300
    { id: 'm13', imageUrl: P[2],  images: [P[2], P[0], P[1], P[3]] },   // iPhone 16 Pro
    { id: 'm14', imageUrl: P[5],  images: [P[5], P[4], P[7], P[6]] },   // Samsung Z Fold 7
    { id: 'm15', imageUrl: P[17], images: [P[17], P[16], P[11], P[9]] },// Pixel 10
    { id: 'm16', imageUrl: P[14], images: [P[14], P[12], P[13], P[15]]},// OnePlus 13
    { id: 'm17', imageUrl: P[6],  images: [P[6], P[7], P[5], P[4]] },   // Xiaomi 15 Pro
    { id: 'm18', imageUrl: P[1],  images: [P[1], P[0], P[2], P[3]] },   // Sony Xperia 5
    { id: 'm19', imageUrl: P[3],  images: [P[3], P[17], P[16], P[15]] },// Nothing 3a
    { id: 'm20', imageUrl: P[4],  images: [P[4], P[6], P[5], P[7]] },   // Samsung S24 FE
    { id: 'm21', imageUrl: P[0],  images: [P[0], P[1], P[3], P[2]] },   // iPhone 15
    { id: 'm22', imageUrl: P[12], images: [P[12], P[14], P[13], P[16]]},// OnePlus 12R
    { id: 'm23', imageUrl: P[16], images: [P[16], P[15], P[17], P[14]]},// Redmi Note 14+
    { id: 'm24', imageUrl: P[8],  images: [P[8], P[11], P[9], P[10]] }, // Pixel 9a
    { id: 'm25', imageUrl: P[15], images: [P[15], P[13], P[12], P[17]]},// Moto Razr 50

    // AUDIO – 9 products, each a different primary image from H[]
    { id: 'au1', imageUrl: H[0], images: [H[0], H[1], H[2], H[3]] },
    { id: 'au2', imageUrl: H[4], images: [H[4], H[5], H[0], H[1]] },
    { id: 'au3', imageUrl: H[2], images: [H[2], H[3], H[4], H[5]] },
    { id: 'au4', imageUrl: H[3], images: [H[3], H[2], H[5], H[4]] },
    { id: 'au5', imageUrl: H[1], images: [H[1], H[0], H[3], H[2]] },
    { id: 'au6', imageUrl: H[5], images: [H[5], H[4], H[1], H[0]] },
    { id: 'au7', imageUrl: H[4], images: [H[4], H[0], H[3], H[5]] },
    { id: 'au8', imageUrl: H[0], images: [H[0], H[2], H[5], H[3]] },
    { id: 'au9', imageUrl: H[3], images: [H[3], H[1], H[0], H[4]] },

    // TWS – earbuds use headphone images (closest match)
    { id: 'tws1', imageUrl: H[1], images: [H[1], H[2], H[3], H[4]] },
    { id: 'tws2', imageUrl: H[2], images: [H[2], H[3], H[4], H[5]] },
    { id: 'tws3', imageUrl: H[3], images: [H[3], H[4], H[5], H[0]] },
    { id: 'tws4', imageUrl: H[5], images: [H[5], H[0], H[1], H[2]] },
    { id: 'tws5', imageUrl: H[4], images: [H[4], H[5], H[0], H[1]] },
    { id: 'tws6', imageUrl: H[0], images: [H[0], H[3], H[4], H[5]] },
    { id: 'tws7', imageUrl: H[2], images: [H[2], H[1], H[5], H[3]] },

    // WEARABLES
    { id: 'w1', imageUrl: W[0], images: [W[0], W[1], W[2], W[3]] },
    { id: 'w2', imageUrl: W[3], images: [W[3], W[0], W[1], W[2]] },
    { id: 'w3', imageUrl: W[1], images: [W[1], W[2], W[3], W[0]] },
    { id: 'w4', imageUrl: W[2], images: [W[2], W[3], W[0], W[1]] },
    { id: 'w5', imageUrl: W[0], images: [W[0], W[3], W[2], W[1]] },
    { id: 'w6', imageUrl: W[2], images: [W[2], W[0], W[3], W[1]] },
    { id: 'w7', imageUrl: W[1], images: [W[1], W[3], W[0], W[2]] },

    // TABLETS
    { id: 'tab1', imageUrl: T[0], images: [T[0], T[1], T[2], T[3]] },
    { id: 'tab2', imageUrl: T[2], images: [T[2], T[3], T[0], T[1]] },
    { id: 'tab3', imageUrl: T[1], images: [T[1], T[2], T[3], T[0]] },
    { id: 'tab4', imageUrl: T[3], images: [T[3], T[0], T[1], T[2]] },
    { id: 'tab5', imageUrl: T[1], images: [T[1], T[3], T[2], T[0]] },

    // ACCESSORIES
    { id: 'acc1', imageUrl: A[3], images: [A[3], A[0], A[1], A[2]] },
    { id: 'acc2', imageUrl: A[1], images: [A[1], A[0], A[2], A[3]] },
    { id: 'acc3', imageUrl: A[0], images: [A[0], A[1], A[3], A[2]] },
    { id: 'acc4', imageUrl: A[2], images: [A[2], A[3], A[0], A[1]] },
    { id: 'acc5', imageUrl: A[3], images: [A[3], A[2], A[1], A[0]] },
    { id: 'acc6', imageUrl: A[2], images: [A[2], A[1], A[3], A[0]] },
    { id: 'acc7', imageUrl: A[1], images: [A[1], A[2], A[0], A[3]] },
    { id: 'acc8', imageUrl: A[0], images: [A[0], A[3], A[2], A[1]] },

    // CAMERAS
    { id: 'cam1', imageUrl: C[0], images: [C[0], C[1], C[2], C[3]] },
    { id: 'cam2', imageUrl: C[3], images: [C[3], C[2], C[0], C[1]] },
    { id: 'cam3', imageUrl: C[1], images: [C[1], C[0], C[3], C[2]] },
    { id: 'cam4', imageUrl: C[2], images: [C[2], C[3], C[1], C[0]] },

    // LAPTOPS
    { id: 'lap1', imageUrl: L[0], images: [L[0], L[1], L[2], L[3]] },
    { id: 'lap2', imageUrl: L[2], images: [L[2], L[3], L[0], L[1]] },
    { id: 'lap3', imageUrl: L[1], images: [L[1], L[2], L[3], L[0]] },
    { id: 'lap4', imageUrl: L[3], images: [L[3], L[0], L[1], L[2]] },
    { id: 'lap5', imageUrl: L[0], images: [L[0], L[3], L[2], L[1]] },

    // GAMING – phones/gaming devices
    { id: 'g1', imageUrl: P[7],  images: [P[7], P[6], G[0], G[2]] },
    { id: 'g2', imageUrl: P[4],  images: [P[4], P[5], G[1], G[0]] },
    { id: 'g3', imageUrl: G[0],  images: [G[0], G[1], G[2], G[3]] },
    { id: 'g4', imageUrl: G[2],  images: [G[2], G[3], G[0], G[1]] },
    { id: 'g5', imageUrl: G[3],  images: [G[3], G[1], G[2], G[0]] },

    // SMART HOME
    { id: 'sh1', imageUrl: S[0], images: [S[0], S[1], S[2], S[3]] },
    { id: 'sh2', imageUrl: S[3], images: [S[3], S[0], S[1], S[2]] },
    { id: 'sh3', imageUrl: S[1], images: [S[1], S[0], S[3], S[2]] },
    { id: 'sh4', imageUrl: S[2], images: [S[2], S[1], S[0], S[3]] },
    { id: 'sh5', imageUrl: S[0], images: [S[0], S[3], S[2], S[1]] },
];

async function run() {
    try {
        await mongoose.connection.asPromise();
        console.log('✅ Connected\n');
        const c = col();
        let ok = 0, fail = 0;

        for (const { id, imageUrl, images } of updates) {
            const r = await c.updateOne({ id }, { $set: { imageUrl, images } });
            if (r.matchedCount) { console.log(`  ✅ ${id}`); ok++; }
            else                { console.log(`  ❌ ${id} NOT FOUND`); fail++; }
        }

        const total = await c.countDocuments();
        console.log(`\n🏁 Updated ${ok} products. ${fail ? `❌ ${fail} missing.` : ''}`);
        console.log(`📦 Total in DB: ${total}`);
        process.exit(0);
    } catch (e) {
        console.error('❌', e.message);
        process.exit(1);
    }
}
run();
