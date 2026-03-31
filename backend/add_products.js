const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobileshop';

const productSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    description: String,
    imageUrl: String,
    images: [String],
    category: String,
    stock: Number,
    rating: Number,
    reviewsCount: Number,
    seller: String,
    deliveryBy: String,
    specs: mongoose.Schema.Types.Mixed,
    features: [String]
});
const Product = mongoose.model('Product', productSchema);

const u = (id, w = 800, h = 800) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const newProducts = [

    // ── MORE MOBILES ──────────────────────────────────────────────────────────
    {
        id: 'm20', name: 'Samsung Galaxy S24 FE', price: 54999, originalPrice: 64999, discount: 15,
        category: 'mobile',
        imageUrl: u('1610945265064-0e34e5519bbf'),
        images: [u('1610945265064-0e34e5519bbf'), u('1587829741301-dc798b83add3'), u('1546954907-3a50cd0e3bb2'), u('1555487505-8603a1a69755')],
        stock: 60, rating: 4.6, reviewsCount: 2100, seller: 'Nexus Official', deliveryBy: 'Express 24h',
        description: 'Fan Edition flagship with Galaxy AI and 50MP triple camera at an accessible price.',
        specs: { 'Processor': 'Exynos 2500', 'Display': '6.7" Dynamic AMOLED 2X 120Hz', 'Camera': '50MP + 10MP + 12MP', 'Battery': '4900mAh 45W', 'RAM': '8GB', 'OS': 'Android 14 One UI 6.1' },
        features: ['Galaxy AI features', '50MP triple camera', '45W super fast charge', 'IP68 water resistant', 'Gorilla Glass Victus+']
    },
    {
        id: 'm21', name: 'iPhone 15', price: 69999, originalPrice: 79999, discount: 13,
        category: 'mobile',
        imageUrl: u('1592899677977-9c10ca588bbd'),
        images: [u('1592899677977-9c10ca588bbd'), u('1510557880182-3d4d3cba35a5'), u('1574755393849-d29ab9dbc6b9'), u('1585060544812-6b45742d762f')],
        stock: 45, rating: 4.7, reviewsCount: 3800, seller: 'Nexus Official', deliveryBy: 'Express 24h',
        description: 'USB-C iPhone with Dynamic Island, 48MP camera, and A16 Bionic chip.',
        specs: { 'Processor': 'A16 Bionic', 'Display': '6.1" Super Retina XDR OLED', 'Camera': '48MP Main + 12MP UW', 'Battery': '3877mAh 20W', 'Storage': '128GB–512GB', 'OS': 'iOS 17' },
        features: ['Dynamic Island', '48MP Main Camera', 'USB-C connectivity', 'Ceramic Shield front', 'Emergency SOS via Satellite']
    },
    {
        id: 'm22', name: 'OnePlus 12R', price: 39999, originalPrice: 47999, discount: 17,
        category: 'mobile',
        imageUrl: u('1636496224984-be84a9c07a22'),
        images: [u('1636496224984-be84a9c07a22'), u('1629571534922-d5e1edcede82'), u('1544244015-0df4b3ffc6b0'), u('1587742177015-1b22a0e3f0f0')],
        stock: 70, rating: 4.6, reviewsCount: 1900, seller: 'Nexus Official', deliveryBy: 'Express 24h',
        description: 'Snapdragon 8 Gen 2 powerhouse with 100W SUPERVOOC and OxygenOS.',
        specs: { 'Processor': 'Snapdragon 8 Gen 2', 'Display': '6.78" LTPO AMOLED 120Hz', 'Camera': '50MP Sony IMX890 + 8MP + 2MP', 'Battery': '5400mAh 100W', 'RAM': '8GB/16GB', 'OS': 'OxygenOS 14' },
        features: ['100W SUPERVOOC charging', 'Snapdragon 8 Gen 2', 'Alert Slider', '5400mAh large battery', 'OxygenOS smooth experience']
    },
    {
        id: 'm23', name: 'Xiaomi Redmi Note 14 Pro+', price: 31999, originalPrice: 37999, discount: 16,
        category: 'mobile',
        imageUrl: u('1551355738-1875b4b5e4e3'),
        images: [u('1551355738-1875b4b5e4e3'), u('1585060544812-6b45742d762f'), u('1519163703-d69e83a0c13b'), u('1546954907-3a50cd0e3bb2')],
        stock: 80, rating: 4.5, reviewsCount: 2700, seller: 'Nexus Official', deliveryBy: 'Express 24h',
        description: '200MP camera phone with Dimensity 8300 Ultra and 90W HyperCharge.',
        specs: { 'Processor': 'Dimensity 8300 Ultra', 'Display': '6.67" AMOLED 144Hz', 'Camera': '200MP + 8MP + 2MP', 'Battery': '5110mAh 90W', 'RAM': '8GB/12GB', 'OS': 'MIUI 14' },
        features: ['200MP main camera', '90W HyperCharge', '144Hz AMOLED display', 'IP68 rated', 'Leica optics tuning']
    },
    {
        id: 'm24', name: 'Google Pixel 9a', price: 52999, originalPrice: 59999, discount: 12,
        category: 'mobile',
        imageUrl: u('1598327105666-5b89351aff23'),
        images: [u('1598327105666-5b89351aff23'), u('1607936854526-f8b4e76a5b50'), u('1511707171634-5f897ff02aa9'), u('1616348436168-de43ad0db364')],
        stock: 40, rating: 4.7, reviewsCount: 1600, seller: 'Nexus Official', deliveryBy: 'Express 24h',
        description: 'Affordable Pixel with Tensor G4, 7 years updates and Google AI features.',
        specs: { 'Processor': 'Google Tensor G4', 'Display': '6.1" OLED 120Hz', 'Camera': '48MP + 13MP UW', 'Battery': '4700mAh 18W', 'OS': 'Android 15 Stock', 'Updates': '7 Years' },
        features: ['7-year Android updates', 'Magic Eraser & Best Take', 'Titan M2 security chip', 'Google AI features', 'Clean stock Android']
    },
    {
        id: 'm25', name: 'Motorola Razr 50 Ultra', price: 89999, originalPrice: 104999, discount: 14,
        category: 'mobile',
        imageUrl: u('1587742177015-1b22a0e3f0f0'),
        images: [u('1587742177015-1b22a0e3f0f0'), u('1544244015-0df4b3ffc6b0'), u('1551355738-1875b4b5e4e3'), u('1592899677977-9c10ca588bbd')],
        stock: 25, rating: 4.6, reviewsCount: 980, seller: 'Nexus Official', deliveryBy: 'Express 24h',
        description: 'Premium flip phone with 4" cover display and Snapdragon 8s Gen 3.',
        specs: { 'Processor': 'Snapdragon 8s Gen 3', 'Display': '6.9" pOLED 165Hz foldable', 'Cover Display': '4.0" HD+ OLED', 'Camera': '50MP OIS + 50MP Tele', 'Battery': '4000mAh 45W' },
        features: ['4" large cover display', '165Hz foldable pOLED', 'Moto AI built-in', '45W turbo charging', 'Gorilla Glass Victus']
    },

    // ── MORE AUDIO ─────────────────────────────────────────────────────────────
    {
        id: 'au7', name: 'Beats Studio Pro', price: 32999, originalPrice: 37999, discount: 13,
        category: 'audio',
        imageUrl: u('1546435989-70fdcd9e8d8f'),
        images: [u('1546435989-70fdcd9e8d8f'), u('1505740420928-5e560c06d30e'), u('1583394838336-acd977736f90'), u('1484704849700-f032a568e944')],
        stock: 30, rating: 4.7, reviewsCount: 1800, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'USB-C Beats with Apple & Android full feature support and 40h battery.',
        specs: { 'ANC': 'Personalized ANC', 'Battery': '40 hours', 'Connectivity': 'Bluetooth 5.3 + USB-C audio', 'Codec': 'AAC, SBC' },
        features: ['Personalized ANC', '40h battery life', 'USB-C lossless audio', 'Works with Apple + Android', 'UltraFine driver acoustics']
    },
    {
        id: 'au8', name: 'Sony WH-CH720N', price: 10999, originalPrice: 13999, discount: 21,
        category: 'audio',
        imageUrl: u('1484704849700-f032a568e944'),
        images: [u('1484704849700-f032a568e944'), u('1546435989-70fdcd9e8d8f'), u('1505740420928-5e560c06d30e'), u('1583394838336-acd977736f90')],
        stock: 60, rating: 4.5, reviewsCount: 2400, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Lightweight ANC headphones with 35h battery and multipoint connection.',
        specs: { 'ANC': 'Dual-mic ANC', 'Battery': '35 hours', 'Weight': '192g', 'Connectivity': 'Bluetooth 5.2 Multipoint' },
        features: ['Lightest Sony ANC at 192g', '35h battery', 'Multipoint 2-device', 'Speak-to-Chat', 'Quick charge 3 min = 1h']
    },
    {
        id: 'au9', name: 'Jabra Evolve2 85', price: 34999, originalPrice: 39999, discount: 13,
        category: 'audio',
        imageUrl: u('1583394838336-acd977736f90'),
        images: [u('1583394838336-acd977736f90'), u('1484704849700-f032a568e944'), u('1546435989-70fdcd9e8d8f'), u('1505740420928-5e560c06d30e')],
        stock: 20, rating: 4.8, reviewsCount: 1100, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Professional-grade ANC headset with 8-mic call clarity and 37h battery.',
        specs: { 'ANC': '10-mic Advanced ANC', 'Battery': '37 hours', 'Connectivity': 'Bluetooth 5.0 + USB-A/C dongle', 'Codec': 'aptX Adaptive' },
        features: ['10-mic Advanced ANC', 'Professional call clarity', '37h battery', 'USB dongle for zero-lag', 'Busy light indicator']
    },

    // ── MORE TWS ───────────────────────────────────────────────────────────────
    {
        id: 'tws5', name: 'OnePlus Buds Pro 3', price: 11999, originalPrice: 14999, discount: 20,
        category: 'tws',
        imageUrl: u('1605464315954-abefff87dbd5'),
        images: [u('1605464315954-abefff87dbd5'), u('1546435989-70fdcd9e8d8f'), u('1583394838336-acd977736f90'), u('1484704849700-f032a568e944')],
        stock: 55, rating: 4.7, reviewsCount: 1700, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Hi-Res Audio TWS with dual drivers and 49dB industry-leading ANC.',
        specs: { 'ANC': 'Up to 49dB', 'Battery': '10h + 43h case', 'Codec': 'LHDC 5.0, AAC', 'Driver': '11mm + 6mm dual-driver' },
        features: ['49dB deep ANC', 'Dual-driver Hi-Res audio', 'LHDC 5.0 wireless', '10h single charge', 'Adaptive EQ + noise reduction']
    },
    {
        id: 'tws6', name: 'Bose QuietComfort Earbuds II', price: 22999, originalPrice: 27999, discount: 18,
        category: 'tws',
        imageUrl: u('1505740420928-5e560c06d30e'),
        images: [u('1505740420928-5e560c06d30e'), u('1546435989-70fdcd9e8d8f'), u('1484704849700-f032a568e944'), u('1583394838336-acd977736f90')],
        stock: 30, rating: 4.8, reviewsCount: 2200, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'World-class ANC earbuds with personalized fit and 6h battery.',
        specs: { 'ANC': 'CustomTune personalized ANC', 'Battery': '6h + 24h case', 'IP': 'IPX4', 'Connectivity': 'Bluetooth 5.3' },
        features: ['CustomTune ANC personalization', 'Aware mode for surroundings', '6h + 24h case battery', 'IPX4 sweat proof', 'Touch controls']
    },
    {
        id: 'tws7', name: 'Realme Buds Air 6 Pro', price: 4999, originalPrice: 6999, discount: 29,
        category: 'tws',
        imageUrl: u('1612444460-1a19ea9f5e27'),
        images: [u('1612444460-1a19ea9f5e27'), u('1600086827875-a63b01f1d0a9'), u('1546435989-70fdcd9e8d8f'), u('1505740420928-5e560c06d30e')],
        stock: 100, rating: 4.4, reviewsCount: 3500, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Budget king TWS with 50dB ANC and LDAC Hi-Res audio under ₹5000.',
        specs: { 'ANC': 'Up to 50dB', 'Battery': '7h + 28h case', 'Codec': 'LDAC, AAC', 'Driver': '12.4mm dynamic' },
        features: ['50dB ANC budget record', 'LDAC Hi-Res Wireless', '7h playback + 28h case', '12.4mm large driver', 'Low-latency gaming mode']
    },

    // ── MORE WEARABLES ─────────────────────────────────────────────────────────
    {
        id: 'w5', name: 'Fitbit Charge 6', price: 14999, originalPrice: 17999, discount: 17,
        category: 'wearable',
        imageUrl: u('1523475496153-3f5b9c0a4da4'),
        images: [u('1523475496153-3f5b9c0a4da4'), u('1551816230-ef5deaed4a26'), u('1546868871-7041f2a55e12'), u('1579586337278-79c4a0edd37a')],
        stock: 45, rating: 4.5, reviewsCount: 2800, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Google-integrated fitness tracker with ECG, GPS, and 7-day battery.',
        specs: { 'Display': '1.04" AMOLED', 'Battery': '7 days', 'GPS': 'Built-in multi-path GPS', 'Health': 'ECG, SpO2, Stress' },
        features: ['Built-in GPS tracking', 'ECG heart rhythm check', 'Google Maps navigation', 'YouTube Music control', '7-day battery life']
    },
    {
        id: 'w6', name: 'Amazfit GTR 4', price: 12999, originalPrice: 16999, discount: 24,
        category: 'wearable',
        imageUrl: u('1546868871-7041f2a55e12'),
        images: [u('1546868871-7041f2a55e12'), u('1523475496153-3f5b9c0a4da4'), u('1579586337278-79c4a0edd37a'), u('1551816230-ef5deaed4a26')],
        stock: 50, rating: 4.5, reviewsCount: 2100, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '14-day battery smartwatch with dual-band GPS and Zepp OS 2.0.',
        specs: { 'Display': '1.43" AMOLED 466x466', 'Battery': '14 days', 'GPS': 'Dual-band GPS/GLONASS', 'Health': 'BioTracker 4.0 PPG + ECG' },
        features: ['14-day battery life', 'Dual-band GPS accuracy', '150+ sport modes', 'BioTracker 4.0 health', 'Alexa built-in']
    },
    {
        id: 'w7', name: 'Noise ColorFit Ultra 3', price: 4999, originalPrice: 7999, discount: 38,
        category: 'wearable',
        imageUrl: u('1551816230-ef5deaed4a26'),
        images: [u('1551816230-ef5deaed4a26'), u('1546868871-7041f2a55e12'), u('1523475496153-3f5b9c0a4da4'), u('1579586337278-79c4a0edd37a')],
        stock: 120, rating: 4.3, reviewsCount: 5400, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '1.96" AMOLED budget smartwatch with BT calling and 7-day battery.',
        specs: { 'Display': '1.96" AMOLED', 'Battery': '7 days', 'Calling': 'Bluetooth calling', 'Health': 'SpO2, Heart Rate, Stress' },
        features: ['1.96" large AMOLED', 'Bluetooth calling', '100+ watch faces', 'Health monitoring suite', '7-day battery']
    },

    // ── MORE TABLETS ───────────────────────────────────────────────────────────
    {
        id: 'tab4', name: 'Samsung Galaxy Tab A9+', price: 29999, originalPrice: 35999, discount: 17,
        category: 'tablet',
        imageUrl: u('1519389950473-47ba0277781c'),
        images: [u('1519389950473-47ba0277781c'), u('1544244015-0df4b3ffc6b0'), u('1587202372775-e229f172b9d1'), u('1561154464-02584748-4f18-a2b0-065a0f2c91ab')],
        stock: 35, rating: 4.5, reviewsCount: 1800, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '11" entertainment tablet with Snapdragon 695 and quad Dolby Atmos speakers.',
        specs: { 'Chip': 'Snapdragon 695', 'Display': '11" WUXGA+ 90Hz TFT', 'Battery': '7040mAh 25W', 'RAM': '4GB / 8GB', 'Storage': '64GB/128GB' },
        features: ['Quad Dolby Atmos speakers', '90Hz smooth display', 'DeX mode support', 'Wi-Fi 6 fast wireless', 'Kids home with parental controls']
    },
    {
        id: 'tab5', name: 'Xiaomi Pad 7', price: 34999, originalPrice: 41999, discount: 17,
        category: 'tablet',
        imageUrl: u('1587202372775-e229f172b9d1'),
        images: [u('1587202372775-e229f172b9d1'), u('1519389950473-47ba0277781c'), u('1544244015-0df4b3ffc6b0'), u('1561154464-02584748-4f18-a2b0-065a0f2c91ab')],
        stock: 30, rating: 4.6, reviewsCount: 1300, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '11.2" 3K 144Hz tablet with Snapdragon 7+ Gen 3 and 8850mAh.',
        specs: { 'Chip': 'Snapdragon 7+ Gen 3', 'Display': '11.2" 3K 144Hz OLED', 'Battery': '8850mAh 45W', 'RAM': '8GB/12GB' },
        features: ['3K 144Hz OLED display', '8850mAh big battery', 'Xiaomi Stylus support', 'HyperOS features', 'Dolby Vision + Atmos']
    },

    // ── MORE ACCESSORIES ───────────────────────────────────────────────────────
    {
        id: 'acc5', name: 'Belkin 3-in-1 MagSafe Charging Stand', price: 8999, originalPrice: 10999, discount: 18,
        category: 'accessory',
        imageUrl: u('1556742049-0cfed4f6a45d'),
        images: [u('1556742049-0cfed4f6a45d'), u('1591799264318-7e6ef8ddb7ea'), u('1585771724684-b4a1db85cb39'), u('1609091839311-d5365f9ff1c5')],
        stock: 50, rating: 4.7, reviewsCount: 1900, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Simultaneously charge iPhone, Apple Watch, and AirPods in one stand.',
        specs: { 'Charging': 'MagSafe 15W + 5W Watch + 5W AirPods', 'Compatibility': 'iPhone 12+, all AW, AirPods Pro', 'Cable': '1m USB-C' },
        features: ['Charges 3 Apple devices at once', 'MagSafe 15W fast charge', 'Apple Watch fast charging', 'Fold flat to travel', 'Kickstand viewing angle']
    },
    {
        id: 'acc6', name: 'ESR Glass Screen Protector', price: 599, originalPrice: 999, discount: 40,
        category: 'accessory',
        imageUrl: u('1591799264318-7e6ef8ddb7ea'),
        images: [u('1591799264318-7e6ef8ddb7ea'), u('1556742049-0cfed4f6a45d'), u('1609091839311-d5365f9ff1c5'), u('1585771724684-b4a1db85cb39')],
        stock: 300, rating: 4.6, reviewsCount: 8900, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '9H tempered glass with easy auto-alignment frame for zero bubbles.',
        specs: { 'Hardness': '9H Tempered Glass', 'Thickness': '0.3mm ultra-thin', 'Touch': '100% touch sensitivity', 'Install': 'Auto-alignment frame' },
        features: ['9H anti-scratch hardness', 'Auto-alignment bubble-free', '0.3mm ultra-thin', 'Oleophobic fingerprint coating', 'Case-friendly edges']
    },
    {
        id: 'acc7', name: 'Ugreen 100W USB-C Hub 7-in-1', price: 3499, originalPrice: 4999, discount: 30,
        category: 'accessory',
        imageUrl: u('1609091839311-d5365f9ff1c5'),
        images: [u('1609091839311-d5365f9ff1c5'), u('1585771724684-b4a1db85cb39'), u('1556742049-0cfed4f6a45d'), u('1591799264318-7e6ef8ddb7ea')],
        stock: 80, rating: 4.8, reviewsCount: 3100, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '7-in-1 USB-C hub with 100W PD, 4K HDMI, SD/TF and USB 3.0.',
        specs: { 'Ports': 'USB-C PD 100W, 4K HDMI, USB-A 3.0 x2, SD, TF, USB-C data', 'Power Delivery': '100W passthrough', 'Video': '4K@30Hz HDMI' },
        features: ['100W Power Delivery pass-through', '4K HDMI output', 'SD + TF card reader', '2x USB-A 3.0 ports', 'Compact aluminum body']
    },
    {
        id: 'acc8', name: 'JBL Flip 7 Bluetooth Speaker', price: 13999, originalPrice: 16999, discount: 18,
        category: 'accessory',
        imageUrl: u('1585771724684-b4a1db85cb39'),
        images: [u('1585771724684-b4a1db85cb39'), u('1609091839311-d5365f9ff1c5'), u('1591799264318-7e6ef8ddb7ea'), u('1556742049-0cfed4f6a45d')],
        stock: 60, rating: 4.7, reviewsCount: 4200, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Portable IP67 speaker with Auracast multi-speaker sync and 12h battery.',
        specs: { 'Output': '30W stereo sound', 'Battery': '12 hours', 'IP': 'IP67 waterproof + dustproof', 'Feature': 'Auracast + AI sound' },
        features: ['IP67 fully waterproof', 'Auracast multi-speaker sync', '12h non-stop battery', 'JBL AI sound optimization', 'USB-C quick charge']
    },

    // ── MORE LAPTOPS ───────────────────────────────────────────────────────────
    {
        id: 'lap3', name: 'Dell XPS 15 9530', price: 169999, originalPrice: 189999, discount: 11,
        category: 'laptop',
        imageUrl: u('d8kp7EPgAmQ'),
        images: [u('d8kp7EPgAmQ'), u('1593642632559-0c6d3fc62b89'), u('1541807084-5c52e6a2e2ce'), u('1496181133206-80ce9b88bbr7')],
        stock: 10, rating: 4.8, reviewsCount: 48, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Creator laptop with OLED 3.5K touch display and RTX 4070 GPU.',
        specs: { 'CPU': 'Intel Core i9-13900H', 'GPU': 'NVIDIA RTX 4070 8GB', 'Display': '15.6" OLED 3.5K 120Hz Touch', 'RAM': '32GB DDR5', 'Storage': '1TB NVMe SSD' },
        features: ['Fast Sync', 'OLED 3.5K 120Hz Touch', 'RTX 4070 creator GPU', 'Thunderbolt 4 x2', 'CNC machined aluminum', 'Studio-quality speakers']
    },
    {
        id: 'lap4', name: 'HP Spectre x360 14', price: 149999, originalPrice: 169999, discount: 12,
        category: 'laptop',
        imageUrl: u('1541807084-5c52e6a2e2ce'),
        images: [u('1541807084-5c52e6a2e2ce'), u('1517336714731-489689fd1ca8'), u('1496181133206-80ce9b88bbr7'), u('1593642632559-0c6d3fc62b89')],
        stock: 12, rating: 4.7, reviewsCount: 1100, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '2-in-1 laptop with OLED 2.8K touch, Intel Evo and 17h battery.',
        specs: { 'CPU': 'Intel Core Ultra 7 165H', 'Display': '14" 2.8K OLED 120Hz Touch 360°', 'Battery': '17 hours', 'RAM': '32GB LPDDR5', 'Storage': '1TB SSD' },
        features: ['360° convertible 2-in-1', '2.8K OLED 120Hz touch', '17h battery life', 'Intel Evo certified', 'HP AI Noise Cancellation']
    },
    {
        id: 'lap5', name: 'Lenovo ThinkPad X1 Carbon Gen 12', price: 159999, originalPrice: 179999, discount: 11,
        category: 'laptop',
        imageUrl: u('xKy9YIsm8B4'),
        images: [u('xKy9YIsm8B4'), u('1541807084-5c52e6a2e2ce'), u('1517336714731-489689fd1ca8'), u('1496181133206-80ce9b88bbr7')],
        stock: 8, rating: 4.9, reviewsCount: 50, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Ultra-light business laptop at 1.12kg with MIL-SPEC durability.',
        specs: { 'CPU': 'Intel Core Ultra 7 165U', 'Display': '14" IPS 2.8K 120Hz', 'Weight': '1.12 kg', 'Battery': '15 hours', 'RAM': '32GB LPDDR5' },
        features: ['Fast Sync', 'Only 1.12kg ultralight', 'MIL-SPEC 12 test certified', 'Thunderbolt 4 x2', 'vPro security platform', '15h battery life']
    },

    // ── MORE CAMERAS ───────────────────────────────────────────────────────────
    {
        id: 'cam3', name: 'Canon EOS R6 Mark II', price: 234990, originalPrice: 259990, discount: 10,
        category: 'camera',
        imageUrl: u('1495121553079-4c85d8613f00'),
        images: [u('1495121553079-4c85d8613f00'), u('1500634245200-e5a50b8a5c6a'), u('1502920822851-7f7d2b68cb22'), u('1606103516804-ed4a57e7-217a')],
        stock: 8, rating: 4.9, reviewsCount: 1200, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Professional mirrorless with 40fps burst and 4K 60fps uncropped video.',
        specs: { 'Sensor': '24.2MP Full-Frame CMOS', 'Video': '4K 60fps uncropped 10-bit', 'AF': 'Dual Pixel CMOS AF II', 'IBIS': '8-stop', 'Burst': '40fps e-shutter' },
        features: ['40fps electronic burst', '4K 60fps uncropped', '8-stop IBIS', 'Eye + Animal AF', 'Dual SD card slots']
    },
    {
        id: 'cam4', name: 'DJI Osmo Pocket 3', price: 54999, originalPrice: 59999, discount: 8,
        category: 'camera',
        imageUrl: u('1500634245200-e5a50b8a5c6a'),
        images: [u('1500634245200-e5a50b8a5c6a'), u('1495121553079-4c85d8613f00'), u('1502920822851-7f7d2b68cb22'), u('1606103516804-ed4a57e7-217a')],
        stock: 20, rating: 4.8, reviewsCount: 1600, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Pocket gimbal camera with 1-inch sensor, 4K 120fps and face tracking.',
        specs: { 'Sensor': '1-inch CMOS', 'Video': '4K 120fps', 'Stabilization': '3-axis gimbal', 'Screen': '2" touch + rotate' },
        features: ['1-inch large sensor', '4K 120fps slow motion', '3-axis gimbal stabilization', 'Active Track face/object follow', '2h battery endurance']
    },

    // ── MORE GAMING ────────────────────────────────────────────────────────────
    {
        id: 'g3', name: 'Sony PlayStation 5 Slim', price: 49990, originalPrice: 54990, discount: 9,
        category: 'gaming',
        imageUrl: u('1557683311-eac922347aa1'),
        images: [u('1557683311-eac922347aa1'), u('1538481199705-c710c4e965fc'), u('1555487505-8603a1a69755'), u('1610945265064-0e34e5519bbf')],
        stock: 20, rating: 4.9, reviewsCount: 5200, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Next-gen gaming console with 4K 120fps, ray tracing and 1TB SSD.',
        specs: { 'CPU': 'AMD Zen 2 8-core 3.5GHz', 'GPU': 'AMD 10.28 TFLOPS RDNA 2', 'Storage': '1TB NVMe SSD', 'Video': '4K 120fps, 8K', 'Ray Tracing': 'Yes' },
        features: ['4K 120fps gaming', 'Ray tracing support', 'Tempest 3D audio', 'DualSense haptic feedback', 'PS5 Game Library']
    },
    {
        id: 'g4', name: 'Xbox Series X', price: 52990, originalPrice: 59990, discount: 12,
        category: 'gaming',
        imageUrl: u('1538481199705-c710c4e965fc'),
        images: [u('1538481199705-c710c4e965fc'), u('1557683311-eac922347aa1'), u('1610945265064-0e34e5519bbf'), u('1555487505-8603a1a69755')],
        stock: 18, rating: 4.8, reviewsCount: 4100, seller: 'Nexus Official', deliveryBy: 'Express',
        description: 'Most powerful Xbox with 12 TFLOPS GPU, 4K 120fps and Game Pass.',
        specs: { 'CPU': 'AMD Zen 2 8-core 3.8GHz', 'GPU': '12 TFLOPS RDNA 2', 'Storage': '1TB NVMe SSD', 'Video': '4K 120fps, 8K', 'Game Pass': 'Included trial' },
        features: ['12 TFLOPS most powerful', 'Xbox Game Pass Ultimate', 'Auto HDR for older games', 'Quick Resume 5 games', 'Smart Delivery optimized']
    },
    {
        id: 'g5', name: 'Nintendo Switch OLED', price: 29999, originalPrice: 34999, discount: 14,
        category: 'gaming',
        imageUrl: u('1556742049-0cfed4f6a45d'),
        images: [u('1556742049-0cfed4f6a45d'), u('1557683311-eac922347aa1'), u('1538481199705-c710c4e965fc'), u('1610945265064-0e34e5519bbf')],
        stock: 35, rating: 4.8, reviewsCount: 6700, seller: 'Nexus Official', deliveryBy: 'Express',
        description: '7" OLED handheld console that docks to TV — play anywhere.',
        specs: { 'Display': '7" OLED 720p', 'Battery': '4.5–9 hours', 'Storage': '64GB expandable', 'Modes': 'TV, Tabletop, Handheld' },
        features: ['7" vivid OLED screen', 'TV dock included', 'Play anywhere any mode', 'Nintendo exclusive titles', 'microSD card expandable']
    },

];

async function addProducts() {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        let added = 0, skipped = 0;
        for (const product of newProducts) {
            const exists = await Product.findOne({ id: product.id });
            if (!exists) {
                await Product.create(product);
                console.log(`  ➕ Added: ${product.name}`);
                added++;
            } else {
                console.log(`  ⏭  Skipped (exists): ${product.name}`);
                skipped++;
            }
        }

        const total = await Product.countDocuments();
        console.log(`\n✅ Done! Added ${added} new products. Skipped ${skipped}. Total in DB: ${total}`);
        process.exit();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

addProducts();
