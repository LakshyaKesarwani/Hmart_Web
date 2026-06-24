-- ============================================================================
-- HMART Seed Data: Synthetic but realistic catalog for an Indian grocery &
-- household essentials store.
-- ============================================================================

begin;

-- ─── Categories ─────────────────────────────────────────────────────────────

insert into public.categories (id, name, slug, description, image_url, sort_order, is_active)
values
  ('c0000001-0000-0000-0000-000000000001', 'Fruits & Vegetables', 'fruits-vegetables', 'Farm-fresh fruits, leafy greens, and seasonal vegetables.', null, 1, true),
  ('c0000001-0000-0000-0000-000000000002', 'Dairy, Bread & Eggs', 'dairy-bread-eggs', 'Milk, curd, paneer, eggs, butter, and fresh bakery bread.', null, 2, true),
  ('c0000001-0000-0000-0000-000000000003', 'Snacks & Munchies', 'snacks-munchies', 'Chips, namkeen, biscuits, and ready-to-eat snacks.', null, 3, true),
  ('c0000001-0000-0000-0000-000000000004', 'Cold Drinks & Juices', 'cold-drinks-juices', 'Soft drinks, juices, coconut water, and energy drinks.', null, 4, true),
  ('c0000001-0000-0000-0000-000000000005', 'Breakfast & Instant Food', 'breakfast-instant-food', 'Oats, cornflakes, noodles, pasta, and ready-to-cook mixes.', null, 5, true),
  ('c0000001-0000-0000-0000-000000000006', 'Atta, Rice & Dal', 'atta-rice-dal', 'Wheat flour, basmati rice, pulses, and whole grains.', null, 6, true),
  ('c0000001-0000-0000-0000-000000000007', 'Tea, Coffee & Health Drinks', 'tea-coffee-health-drinks', 'Tea leaves, coffee powder, green tea, and malt beverages.', null, 7, true),
  ('c0000001-0000-0000-0000-000000000008', 'Cleaning & Household', 'cleaning-household', 'Detergent, floor cleaners, dishwash, and mops.', null, 8, true),
  ('c0000001-0000-0000-0000-000000000009', 'Personal Care', 'personal-care', 'Soaps, shampoo, toothpaste, skincare, and grooming essentials.', null, 9, true),
  ('c0000001-0000-0000-0000-000000000010', 'Baby Care', 'baby-care', 'Diapers, baby food, wipes, and infant toiletries.', null, 10, true),
  ('c0000001-0000-0000-0000-000000000011', 'Stationery & Office', 'stationery-office', 'Pens, notebooks, files, tape, and printer paper.', null, 11, true),
  ('c0000001-0000-0000-0000-000000000012', 'Safety & PPE', 'safety-ppe', 'Masks, gloves, sanitizers, first-aid kits, and safety goggles.', null, 12, true)
on conflict (id) do nothing;

-- ─── Products ───────────────────────────────────────────────────────────────

insert into public.products (id, primary_category_id, name, slug, description, brand, status)
values
  -- Fruits & Vegetables
  ('p0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Fresh Banana (Dozen)', 'fresh-banana-dozen', 'Premium Robusta bananas, hand-picked for ripeness. Naturally sweet and rich in potassium.', 'Fresho', 'active'),
  ('p0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Organic Tomato 500g', 'organic-tomato-500g', 'Firm red tomatoes grown without pesticides. Great for curries, salads, and sauces.', 'Organic Tattva', 'active'),
  ('p0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Baby Spinach 200g', 'baby-spinach-200g', 'Tender baby spinach leaves, pre-washed and ready to eat or cook.', 'Fresho', 'active'),

  -- Dairy, Bread & Eggs
  ('p0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000002', 'Amul Toned Milk 1L', 'amul-toned-milk-1l', 'Pasteurized toned milk with 3% fat. Rich in calcium, ideal for daily use.', 'Amul', 'active'),
  ('p0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000002', 'White Bread 400g', 'white-bread-400g', 'Soft and fresh sandwich bread sliced for convenience. No preservatives.', 'Harvest Gold', 'active'),
  ('p0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000002', 'Farm Eggs (Pack of 12)', 'farm-eggs-pack-12', 'Free-range brown eggs, protein-packed and fresh from the farm.', 'Natures Basket', 'active'),

  -- Snacks & Munchies
  ('p0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000003', 'Lays Classic Salted 52g', 'lays-classic-salted-52g', 'Crispy golden potato chips lightly salted for the perfect crunch.', 'Lays', 'active'),
  ('p0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000003', 'Haldiram Aloo Bhujia 400g', 'haldiram-aloo-bhujia-400g', 'Traditional Indian namkeen made with besan and potato. Crispy and addictive.', 'Haldirams', 'active'),
  ('p0000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000003', 'Parle-G Gold Biscuits 100g', 'parle-g-gold-100g', 'Premium glucose biscuits with extra milk and wheat. A timeless Indian snack.', 'Parle', 'active'),

  -- Cold Drinks & Juices
  ('p0000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000004', 'Coca-Cola 750ml', 'coca-cola-750ml', 'Classic cola refreshment. Serve chilled for best taste.', 'Coca-Cola', 'active'),
  ('p0000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000004', 'Real Mixed Fruit Juice 1L', 'real-mixed-fruit-juice-1l', 'No added sugar fruit juice blend with mango, pineapple, and apple.', 'Real', 'active'),
  ('p0000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000004', 'Paper Boat Aam Panna 200ml', 'paper-boat-aam-panna-200ml', 'Traditional raw mango drink. Tangy, sweet, and refreshing.', 'Paper Boat', 'active'),

  -- Breakfast & Instant Food
  ('p0000001-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000005', 'Kelloggs Corn Flakes 475g', 'kelloggs-corn-flakes-475g', 'Crispy golden flakes of corn, iron-fortified. Perfect breakfast with cold milk.', 'Kelloggs', 'active'),
  ('p0000001-0000-0000-0000-000000000014', 'c0000001-0000-0000-0000-000000000005', 'Maggi 2-Minute Noodles (Pack of 4)', 'maggi-2-min-noodles-4pk', 'Instant masala noodles everyone loves. Ready in 2 minutes.', 'Maggi', 'active'),
  ('p0000001-0000-0000-0000-000000000015', 'c0000001-0000-0000-0000-000000000005', 'Quaker Oats 1kg', 'quaker-oats-1kg', 'Rolled whole-grain oats. High in fibre and heart-healthy.', 'Quaker', 'active'),

  -- Atta, Rice & Dal
  ('p0000001-0000-0000-0000-000000000016', 'c0000001-0000-0000-0000-000000000006', 'Aashirvaad Atta 5kg', 'aashirvaad-atta-5kg', 'Whole wheat flour milled from the finest grains. Soft rotis every time.', 'Aashirvaad', 'active'),
  ('p0000001-0000-0000-0000-000000000017', 'c0000001-0000-0000-0000-000000000006', 'India Gate Basmati Rice 1kg', 'india-gate-basmati-1kg', 'Long-grain aged basmati rice. Fluffy texture ideal for biryani and pulao.', 'India Gate', 'active'),
  ('p0000001-0000-0000-0000-000000000018', 'c0000001-0000-0000-0000-000000000006', 'Toor Dal 1kg', 'toor-dal-1kg', 'Split pigeon peas, unpolished. Cooks evenly, rich earthy flavour.', 'Tata Sampann', 'active'),

  -- Tea, Coffee & Health Drinks
  ('p0000001-0000-0000-0000-000000000019', 'c0000001-0000-0000-0000-000000000007', 'Tata Tea Gold 500g', 'tata-tea-gold-500g', '15% long leaves for a rich aroma. Indias most trusted tea brand.', 'Tata Tea', 'active'),
  ('p0000001-0000-0000-0000-000000000020', 'c0000001-0000-0000-0000-000000000007', 'Nescafe Classic 100g', 'nescafe-classic-100g', 'Instant coffee granules with a bold roasted flavour. Just add hot water.', 'Nescafe', 'active'),
  ('p0000001-0000-0000-0000-000000000021', 'c0000001-0000-0000-0000-000000000007', 'Bournvita 500g Jar', 'bournvita-500g-jar', 'Chocolate health drink fortified with vitamins D and B12.', 'Cadbury', 'active'),

  -- Cleaning & Household
  ('p0000001-0000-0000-0000-000000000022', 'c0000001-0000-0000-0000-000000000008', 'Surf Excel Matic Liquid 1L', 'surf-excel-matic-1l', 'Front-load washing machine detergent liquid. Tough stain removal in cold water.', 'Surf Excel', 'active'),
  ('p0000001-0000-0000-0000-000000000023', 'c0000001-0000-0000-0000-000000000008', 'Lizol Floor Cleaner 500ml', 'lizol-floor-cleaner-500ml', 'Disinfectant floor cleaner kills 99.9% germs. Citrus fragrance.', 'Lizol', 'active'),
  ('p0000001-0000-0000-0000-000000000024', 'c0000001-0000-0000-0000-000000000008', 'Vim Dishwash Bar 200g', 'vim-dishwash-bar-200g', 'Lemon power for sparkling clean utensils. Cuts through grease easily.', 'Vim', 'active'),

  -- Personal Care
  ('p0000001-0000-0000-0000-000000000025', 'c0000001-0000-0000-0000-000000000009', 'Dove Beauty Bar 100g', 'dove-beauty-bar-100g', 'Moisturizing beauty bar with 1/4 cream. Gentle enough for daily face and body use.', 'Dove', 'active'),
  ('p0000001-0000-0000-0000-000000000026', 'c0000001-0000-0000-0000-000000000009', 'Head & Shoulders Shampoo 340ml', 'head-shoulders-shampoo-340ml', 'Anti-dandruff shampoo with zinc pyrithione. Cool menthol variant.', 'Head & Shoulders', 'active'),
  ('p0000001-0000-0000-0000-000000000027', 'c0000001-0000-0000-0000-000000000009', 'Colgate MaxFresh Toothpaste 150g', 'colgate-maxfresh-150g', 'Gel toothpaste with cooling crystals for long-lasting fresh breath.', 'Colgate', 'active'),

  -- Baby Care
  ('p0000001-0000-0000-0000-000000000028', 'c0000001-0000-0000-0000-000000000010', 'Pampers Diapers Medium (Pack of 20)', 'pampers-diapers-medium-20', 'Ultra-soft diapers with 12-hour absorption. Gentle on baby skin.', 'Pampers', 'active'),
  ('p0000001-0000-0000-0000-000000000029', 'c0000001-0000-0000-0000-000000000010', 'Cerelac Stage 2 Wheat Apple 300g', 'cerelac-wheat-apple-300g', 'Iron-fortified baby cereal for 8+ months. Easy to digest.', 'Nestle', 'active'),
  ('p0000001-0000-0000-0000-000000000030', 'c0000001-0000-0000-0000-000000000010', 'Johnson Baby Wipes (Pack of 80)', 'johnson-baby-wipes-80', 'Clinically mild wipes free from alcohol, parabens, and dyes.', 'Johnsons', 'active'),

  -- Stationery & Office
  ('p0000001-0000-0000-0000-000000000031', 'c0000001-0000-0000-0000-000000000011', 'Classmate Notebook 180 Pages', 'classmate-notebook-180pg', 'Single-line ruled long notebook. Smooth writing paper, durable cover.', 'Classmate', 'active'),
  ('p0000001-0000-0000-0000-000000000032', 'c0000001-0000-0000-0000-000000000011', 'Cello Pinpoint Ball Pen (Pack of 10)', 'cello-pinpoint-pen-10pk', 'Fine tip 0.7mm blue ball pens. Smooth ink flow, comfortable grip.', 'Cello', 'active'),
  ('p0000001-0000-0000-0000-000000000033', 'c0000001-0000-0000-0000-000000000011', 'Fevicol MR 200g', 'fevicol-mr-200g', 'White adhesive for paper, craft, and school projects. Non-toxic.', 'Fevicol', 'active'),

  -- Safety & PPE
  ('p0000001-0000-0000-0000-000000000034', 'c0000001-0000-0000-0000-000000000012', 'N95 Face Mask (Pack of 5)', 'n95-mask-pack-5', '5-layer filtration masks with nose clip. BIS certified for PM2.5 protection.', 'Venus', 'active'),
  ('p0000001-0000-0000-0000-000000000035', 'c0000001-0000-0000-0000-000000000012', 'Dettol Hand Sanitizer 200ml', 'dettol-sanitizer-200ml', 'Kills 99.9% germs without water. Original fragrance.', 'Dettol', 'active'),
  ('p0000001-0000-0000-0000-000000000036', 'c0000001-0000-0000-0000-000000000012', 'First Aid Kit (Basic)', 'first-aid-kit-basic', 'Compact kit with bandages, antiseptic cream, cotton, and scissors.', 'Savlon', 'active')
on conflict (id) do nothing;

-- ─── Product Variants (SKU, price, unit) ────────────────────────────────────

insert into public.product_variants (id, product_id, sku, price, unit, is_active)
values
  -- Fruits & Vegetables
  ('v0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'FRU-BAN-DZN', 49.00, '1 dozen', true),
  ('v0000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000002', 'FRU-TOM-500', 42.00, '500 g', true),
  ('v0000001-0000-0000-0000-000000000003', 'p0000001-0000-0000-0000-000000000003', 'FRU-SPN-200', 55.00, '200 g', true),

  -- Dairy, Bread & Eggs
  ('v0000001-0000-0000-0000-000000000004', 'p0000001-0000-0000-0000-000000000004', 'DAI-MLK-1L', 68.00, '1 L', true),
  ('v0000001-0000-0000-0000-000000000005', 'p0000001-0000-0000-0000-000000000005', 'DAI-BRD-400', 45.00, '400 g', true),
  ('v0000001-0000-0000-0000-000000000006', 'p0000001-0000-0000-0000-000000000006', 'DAI-EGG-12', 96.00, '12 pcs', true),

  -- Snacks & Munchies
  ('v0000001-0000-0000-0000-000000000007', 'p0000001-0000-0000-0000-000000000007', 'SNK-LAY-52', 20.00, '52 g', true),
  ('v0000001-0000-0000-0000-000000000008', 'p0000001-0000-0000-0000-000000000008', 'SNK-HAL-400', 160.00, '400 g', true),
  ('v0000001-0000-0000-0000-000000000009', 'p0000001-0000-0000-0000-000000000009', 'SNK-PRL-100', 15.00, '100 g', true),

  -- Cold Drinks & Juices
  ('v0000001-0000-0000-0000-000000000010', 'p0000001-0000-0000-0000-000000000010', 'DRK-COK-750', 45.00, '750 ml', true),
  ('v0000001-0000-0000-0000-000000000011', 'p0000001-0000-0000-0000-000000000011', 'DRK-REL-1L', 110.00, '1 L', true),
  ('v0000001-0000-0000-0000-000000000012', 'p0000001-0000-0000-0000-000000000012', 'DRK-PBT-200', 30.00, '200 ml', true),

  -- Breakfast & Instant Food
  ('v0000001-0000-0000-0000-000000000013', 'p0000001-0000-0000-0000-000000000013', 'BRK-KEL-475', 195.00, '475 g', true),
  ('v0000001-0000-0000-0000-000000000014', 'p0000001-0000-0000-0000-000000000014', 'BRK-MAG-4PK', 56.00, '4 × 70 g', true),
  ('v0000001-0000-0000-0000-000000000015', 'p0000001-0000-0000-0000-000000000015', 'BRK-QKR-1KG', 210.00, '1 kg', true),

  -- Atta, Rice & Dal
  ('v0000001-0000-0000-0000-000000000016', 'p0000001-0000-0000-0000-000000000016', 'GRN-ATA-5KG', 285.00, '5 kg', true),
  ('v0000001-0000-0000-0000-000000000017', 'p0000001-0000-0000-0000-000000000017', 'GRN-RIC-1KG', 195.00, '1 kg', true),
  ('v0000001-0000-0000-0000-000000000018', 'p0000001-0000-0000-0000-000000000018', 'GRN-DAL-1KG', 155.00, '1 kg', true),

  -- Tea, Coffee & Health Drinks
  ('v0000001-0000-0000-0000-000000000019', 'p0000001-0000-0000-0000-000000000019', 'TEA-TAT-500', 290.00, '500 g', true),
  ('v0000001-0000-0000-0000-000000000020', 'p0000001-0000-0000-0000-000000000020', 'TEA-NES-100', 245.00, '100 g', true),
  ('v0000001-0000-0000-0000-000000000021', 'p0000001-0000-0000-0000-000000000021', 'TEA-BVT-500', 260.00, '500 g', true),

  -- Cleaning & Household
  ('v0000001-0000-0000-0000-000000000022', 'p0000001-0000-0000-0000-000000000022', 'CLN-SRF-1L', 225.00, '1 L', true),
  ('v0000001-0000-0000-0000-000000000023', 'p0000001-0000-0000-0000-000000000023', 'CLN-LZL-500', 115.00, '500 ml', true),
  ('v0000001-0000-0000-0000-000000000024', 'p0000001-0000-0000-0000-000000000024', 'CLN-VIM-200', 25.00, '200 g', true),

  -- Personal Care
  ('v0000001-0000-0000-0000-000000000025', 'p0000001-0000-0000-0000-000000000025', 'PER-DOV-100', 65.00, '100 g', true),
  ('v0000001-0000-0000-0000-000000000026', 'p0000001-0000-0000-0000-000000000026', 'PER-HNS-340', 350.00, '340 ml', true),
  ('v0000001-0000-0000-0000-000000000027', 'p0000001-0000-0000-0000-000000000027', 'PER-CLG-150', 99.00, '150 g', true),

  -- Baby Care
  ('v0000001-0000-0000-0000-000000000028', 'p0000001-0000-0000-0000-000000000028', 'BBY-PMP-M20', 499.00, '20 pcs', true),
  ('v0000001-0000-0000-0000-000000000029', 'p0000001-0000-0000-0000-000000000029', 'BBY-CRL-300', 275.00, '300 g', true),
  ('v0000001-0000-0000-0000-000000000030', 'p0000001-0000-0000-0000-000000000030', 'BBY-JWP-80', 185.00, '80 pcs', true),

  -- Stationery & Office
  ('v0000001-0000-0000-0000-000000000031', 'p0000001-0000-0000-0000-000000000031', 'STA-CLM-180', 60.00, '180 pages', true),
  ('v0000001-0000-0000-0000-000000000032', 'p0000001-0000-0000-0000-000000000032', 'STA-CEL-10P', 80.00, '10 pcs', true),
  ('v0000001-0000-0000-0000-000000000033', 'p0000001-0000-0000-0000-000000000033', 'STA-FEV-200', 45.00, '200 g', true),

  -- Safety & PPE
  ('v0000001-0000-0000-0000-000000000034', 'p0000001-0000-0000-0000-000000000034', 'SAF-N95-5PK', 199.00, '5 pcs', true),
  ('v0000001-0000-0000-0000-000000000035', 'p0000001-0000-0000-0000-000000000035', 'SAF-DET-200', 99.00, '200 ml', true),
  ('v0000001-0000-0000-0000-000000000036', 'p0000001-0000-0000-0000-000000000036', 'SAF-FAK-BSC', 349.00, '1 kit', true)
on conflict (id) do nothing;

-- ─── Inventory Location ─────────────────────────────────────────────────────

insert into public.inventory_locations (id, name, code, description, is_active)
values
  ('l0000001-0000-0000-0000-000000000001', 'Main Warehouse', 'WH-MAIN', 'Central HMART warehouse — all categories stocked.', true),
  ('l0000001-0000-0000-0000-000000000002', 'Cold Storage Unit', 'WH-COLD', 'Temperature-controlled storage for dairy & perishables.', true)
on conflict (id) do nothing;

-- ─── Inventory Stock ────────────────────────────────────────────────────────

insert into public.inventory (id, location_id, variant_id, quantity_on_hand, quantity_reserved, reorder_threshold)
values
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000001', 120, 0, 20),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000002', 85, 0, 15),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000003', 60, 0, 10),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000002', 'v0000001-0000-0000-0000-000000000004', 200, 0, 30),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000005', 75, 0, 15),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000002', 'v0000001-0000-0000-0000-000000000006', 150, 0, 25),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000007', 300, 0, 50),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000008', 90, 0, 15),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000009', 250, 0, 40),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000010', 180, 0, 30),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000011', 100, 0, 20),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000012', 200, 0, 40),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000013', 65, 0, 10),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000014', 400, 0, 60),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000015', 55, 0, 10),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000016', 40, 0, 8),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000017', 70, 0, 12),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000018', 90, 0, 15),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000019', 80, 0, 12),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000020', 95, 0, 15),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000021', 70, 0, 10),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000022', 45, 0, 8),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000023', 110, 0, 20),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000024', 200, 0, 35),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000025', 150, 0, 25),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000026', 60, 0, 10),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000027', 130, 0, 20),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000028', 50, 0, 8),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000029', 40, 0, 8),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000030', 75, 0, 12),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000031', 200, 0, 30),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000032', 300, 0, 50),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000033', 150, 0, 25),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000034', 100, 0, 15),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000035', 180, 0, 25),
  (gen_random_uuid(), 'l0000001-0000-0000-0000-000000000001', 'v0000001-0000-0000-0000-000000000036', 35, 0, 5)
on conflict do nothing;

commit;
