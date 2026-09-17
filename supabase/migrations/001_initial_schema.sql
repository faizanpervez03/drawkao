-- Draw Kao Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  letters TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL DEFAULT '📚',
  color TEXT NOT NULL DEFAULT '#2e7d32',
  sort_order INT NOT NULL DEFAULT 0,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2. ITEMS TABLE (letters, fruits, animals, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  label TEXT NOT NULL,
  word TEXT NOT NULL,
  emoji TEXT NOT NULL,
  pronunciation TEXT,
  audio_url TEXT,
  color TEXT NOT NULL DEFAULT '#e57373',
  bg_color TEXT NOT NULL DEFAULT '#ffebee',
  sort_order INT NOT NULL DEFAULT 0,
  drawing_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- ============================================
-- 3. USER PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  stars INT NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. RLS POLICIES (public read for categories & items)
-- ============================================
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Items are publicly readable"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

-- ============================================
-- 6. GRANT ACCESS TO ANON ROLE (for Data API)
-- ============================================
GRANT SELECT ON categories TO anon;
GRANT SELECT ON items TO anon;
GRANT SELECT, INSERT, UPDATE ON user_progress TO anon;

-- Also grant to authenticated role for future auth
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;

-- ============================================
-- 7. SEED DATA: CATEGORIES
-- ============================================
INSERT INTO categories (id, name, description, letters, emoji, color, sort_order, is_recommended)
VALUES
  ('alphabet', 'Alphabet', '26 friendly letter lessons', 'A B C', '🍎', '#2e7d32', 1, true),
  ('fruits', 'Fruits', 'Apples, bananas & berries', '🍎 🍊 🍌', '🍊', '#e57373', 2, false),
  ('animals', 'Animals', 'Kittens, puppies & jungle friends', '🐱 🐶 🐸', '🐱', '#5c9ce6', 3, false),
  ('shapes', 'Shapes', 'Circles, triangles & patterns', '● ▲ ■', '⬡', '#f5a623', 4, false),
  ('numbers', 'Numbers', 'Trace 1 to 20 & count stars', '1 2 3', '⭐', '#9575cd', 5, false),
  ('vehicles', 'Vehicles', 'Cars, trains & airplanes', '🚗 🚂 ✈️', '🚗', '#e57373', 6, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. SEED DATA: ALPHABET ITEMS (A-Z)
-- ============================================
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('a', 'alphabet', 'a', 'A', 'Apple', '🍎', '/ˈæp.əl/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw outline"},{"step":2,"label":"Add stem"},{"step":3,"label":"Draw leaf"},{"step":4,"label":"Color it"}]'),
  ('b', 'alphabet', 'b', 'B', 'Ball', '⚽', '/bɔːl/', '#5c9ce6', '#e3f2fd', 2, '[{"step":1,"label":"Draw circle"},{"step":2,"label":"Add lines"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('c', 'alphabet', 'c', 'C', 'Cat', '🐱', '/kæt/', '#f5a623', '#fff3e0', 3, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add ears"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('d', 'alphabet', 'd', 'D', 'Dog', '🐶', '/dɒɡ/', '#2e7d32', '#e8f5e9', 4, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add ears"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('e', 'alphabet', 'e', 'E', 'Elephant', '🐘', '/ˈel.ɪ.fənt/', '#9575cd', '#ede7f6', 5, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add trunk"},{"step":3,"label":"Add ears"},{"step":4,"label":"Color it"}]'),
  ('f', 'alphabet', 'f', 'F', 'Fish', '🐟', '/fɪʃ/', '#5c9ce6', '#e3f2fd', 6, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add tail"},{"step":3,"label":"Add fins"},{"step":4,"label":"Color it"}]'),
  ('g', 'alphabet', 'g', 'G', 'Grapes', '🍇', '/ɡreɪps/', '#9575cd', '#ede7f6', 7, '[{"step":1,"label":"Draw circles"},{"step":2,"label":"Add stem"},{"step":3,"label":"Add leaf"},{"step":4,"label":"Color it"}]'),
  ('h', 'alphabet', 'h', 'H', 'Hat', '🎩', '/hæt/', '#e57373', '#ffebee', 8, '[{"step":1,"label":"Draw brim"},{"step":2,"label":"Add crown"},{"step":3,"label":"Add band"},{"step":4,"label":"Color it"}]'),
  ('i', 'alphabet', 'i', 'I', 'Ice Cream', '🍦', '/ˌaɪs ˈkriːm/', '#5c9ce6', '#e3f2fd', 9, '[{"step":1,"label":"Draw cone"},{"step":2,"label":"Add scoop"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('j', 'alphabet', 'j', 'J', 'Juice', '🧃', '/dʒuːs/', '#f5a623', '#fff3e0', 10, '[{"step":1,"label":"Draw box"},{"step":2,"label":"Add straw"},{"step":3,"label":"Add label"},{"step":4,"label":"Color it"}]'),
  ('k', 'alphabet', 'k', 'K', 'Kite', '🪁', '/kaɪt/', '#e57373', '#ffebee', 11, '[{"step":1,"label":"Draw diamond"},{"step":2,"label":"Add frame"},{"step":3,"label":"Add tail"},{"step":4,"label":"Color it"}]'),
  ('l', 'alphabet', 'l', 'L', 'Lion', '🦁', '/ˈlaɪ.ən/', '#f5a623', '#fff3e0', 12, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add mane"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('m', 'alphabet', 'm', 'M', 'Moon', '🌙', '/muːn/', '#f5a623', '#fff3e0', 13, '[{"step":1,"label":"Draw crescent"},{"step":2,"label":"Add stars"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('n', 'alphabet', 'n', 'N', 'Nest', '🪹', '/nest/', '#2e7d32', '#e8f5e9', 14, '[{"step":1,"label":"Draw bowl"},{"step":2,"label":"Add twigs"},{"step":3,"label":"Add eggs"},{"step":4,"label":"Color it"}]'),
  ('o', 'alphabet', 'o', 'O', 'Orange', '🍊', '/ˈɒr.ɪndʒ/', '#f5a623', '#fff3e0', 15, '[{"step":1,"label":"Draw circle"},{"step":2,"label":"Add dimple"},{"step":3,"label":"Add leaf"},{"step":4,"label":"Color it"}]'),
  ('p', 'alphabet', 'p', 'P', 'Panda', '🐼', '/ˈpæn.də/', '#2d2d2d', '#f5f3ef', 16, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add eyes"},{"step":3,"label":"Add ears"},{"step":4,"label":"Color it"}]'),
  ('q', 'alphabet', 'q', 'Q', 'Queen', '👑', '/kwiːn/', '#9575cd', '#ede7f6', 17, '[{"step":1,"label":"Draw base"},{"step":2,"label":"Add points"},{"step":3,"label":"Add jewels"},{"step":4,"label":"Color it"}]'),
  ('r', 'alphabet', 'r', 'R', 'Rainbow', '🌈', '/ˈreɪn.boʊ/', '#e57373', '#ffebee', 18, '[{"step":1,"label":"Draw arcs"},{"step":2,"label":"Add colors"},{"step":3,"label":"Add clouds"},{"step":4,"label":"Color it"}]'),
  ('s', 'alphabet', 's', 'S', 'Sun', '☀️', '/sʌn/', '#f5a623', '#fff3e0', 19, '[{"step":1,"label":"Draw circle"},{"step":2,"label":"Add rays"},{"step":3,"label":"Add face"},{"step":4,"label":"Color it"}]'),
  ('t', 'alphabet', 't', 'T', 'Tree', '🌳', '/triː/', '#2e7d32', '#e8f5e9', 20, '[{"step":1,"label":"Draw trunk"},{"step":2,"label":"Add branches"},{"step":3,"label":"Add leaves"},{"step":4,"label":"Color it"}]'),
  ('u', 'alphabet', 'u', 'U', 'Umbrella', '☂️', '/ʌmˈbrel.ə/', '#5c9ce6', '#e3f2fd', 21, '[{"step":1,"label":"Draw dome"},{"step":2,"label":"Add handle"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('v', 'alphabet', 'v', 'V', 'Violin', '🎻', '/ˌvaɪ.əˈlɪn/', '#e57373', '#ffebee', 22, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add neck"},{"step":3,"label":"Add strings"},{"step":4,"label":"Color it"}]'),
  ('w', 'alphabet', 'w', 'W', 'Whale', '🐋', '/weɪl/', '#5c9ce6', '#e3f2fd', 23, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add tail"},{"step":3,"label":"Add eye"},{"step":4,"label":"Color it"}]'),
  ('x', 'alphabet', 'x', 'X', 'Xylophone', '🎵', '/ˈzaɪ.lə.foʊn/', '#9575cd', '#ede7f6', 24, '[{"step":1,"label":"Draw bars"},{"step":2,"label":"Add frame"},{"step":3,"label":"Add mallets"},{"step":4,"label":"Color it"}]'),
  ('y', 'alphabet', 'y', 'Y', 'Yogurt', '🥛', '/ˈjoʊ.ɡərt/', '#5c9ce6', '#e3f2fd', 25, '[{"step":1,"label":"Draw cup"},{"step":2,"label":"Add lid"},{"step":3,"label":"Add label"},{"step":4,"label":"Color it"}]'),
  ('z', 'alphabet', 'z', 'Z', 'Zebra', '🦓', '/ˈziː.brə/', '#2d2d2d', '#f5f3ef', 26, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add stripes"},{"step":3,"label":"Add mane"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. SEED DATA: FRUITS ITEMS
-- ============================================
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('apple', 'fruits', 'apple', 'Apple', 'Apple', '🍎', '/ˈæp.əl/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw outline"},{"step":2,"label":"Add stem"},{"step":3,"label":"Draw leaf"},{"step":4,"label":"Color it"}]'),
  ('banana', 'fruits', 'banana', 'Banana', 'Banana', '🍌', '/bəˈnæn.ə/', '#f5a623', '#fff3e0', 2, '[{"step":1,"label":"Draw curve"},{"step":2,"label":"Add ends"},{"step":3,"label":"Add peel"},{"step":4,"label":"Color it"}]'),
  ('orange', 'fruits', 'orange', 'Orange', 'Orange', '🍊', '/ˈɒr.ɪndʒ/', '#f5a623', '#fff3e0', 3, '[{"step":1,"label":"Draw circle"},{"step":2,"label":"Add dimple"},{"step":3,"label":"Add leaf"},{"step":4,"label":"Color it"}]'),
  ('grape', 'fruits', 'grape', 'Grape', 'Grape', '🍇', '/ɡreɪp/', '#9575cd', '#ede7f6', 4, '[{"step":1,"label":"Draw circles"},{"step":2,"label":"Add stem"},{"step":3,"label":"Add leaf"},{"step":4,"label":"Color it"}]'),
  ('strawberry', 'fruits', 'strawberry', 'Strawberry', 'Strawberry', '🍓', '/ˈstrɔː.bər.i/', '#e57373', '#ffebee', 5, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add seeds"},{"step":3,"label":"Add leaves"},{"step":4,"label":"Color it"}]'),
  ('watermelon', 'fruits', 'watermelon', 'Watermelon', 'Watermelon', '🍉', '/ˈwɔː.tə.mel.ən/', '#2e7d32', '#e8f5e9', 6, '[{"step":1,"label":"Draw slice"},{"step":2,"label":"Add rind"},{"step":3,"label":"Add seeds"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. SEED DATA: ANIMALS ITEMS
-- ============================================
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('cat', 'animals', 'cat', 'Cat', 'Cat', '🐱', '/kæt/', '#f5a623', '#fff3e0', 1, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add ears"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('dog', 'animals', 'dog', 'Dog', 'Dog', '🐶', '/dɒɡ/', '#2e7d32', '#e8f5e9', 2, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add ears"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('fish', 'animals', 'fish', 'Fish', 'Fish', '🐟', '/fɪʃ/', '#5c9ce6', '#e3f2fd', 3, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add tail"},{"step":3,"label":"Add fins"},{"step":4,"label":"Color it"}]'),
  ('lion', 'animals', 'lion', 'Lion', 'Lion', '🦁', '/ˈlaɪ.ən/', '#f5a623', '#fff3e0', 4, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add mane"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('elephant', 'animals', 'elephant', 'Elephant', 'Elephant', '🐘', '/ˈel.ɪ.fənt/', '#9575cd', '#ede7f6', 5, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add trunk"},{"step":3,"label":"Add ears"},{"step":4,"label":"Color it"}]'),
  ('bird', 'animals', 'bird', 'Bird', 'Bird', '🐦', '/bɜːrd/', '#5c9ce6', '#e3f2fd', 6, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wings"},{"step":3,"label":"Add beak"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. SEED DATA: SHAPES ITEMS
-- ============================================
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('circle', 'shapes', 'circle', 'Circle', 'Circle', '⭕', '/ˈsɜːr.kəl/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw circle"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('square', 'shapes', 'square', 'Square', 'Square', '🟧', '/skwer/', '#f5a623', '#fff3e0', 2, '[{"step":1,"label":"Draw square"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('triangle', 'shapes', 'triangle', 'Triangle', 'Triangle', '🔺', '/ˈtraɪ.æŋ.ɡəl/', '#2e7d32', '#e8f5e9', 3, '[{"step":1,"label":"Draw triangle"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('star', 'shapes', 'star', 'Star', 'Star', '⭐', '/stɑːr/', '#f5a623', '#fff3e0', 4, '[{"step":1,"label":"Draw star"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('heart', 'shapes', 'heart', 'Heart', 'Heart', '❤️', '/hɑːrt/', '#e57373', '#ffebee', 5, '[{"step":1,"label":"Draw heart"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('diamond', 'shapes', 'diamond', 'Diamond', 'Diamond', '💎', '/ˈdaɪ.mənd/', '#5c9ce6', '#e3f2fd', 6, '[{"step":1,"label":"Draw diamond"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. SEED DATA: NUMBERS ITEMS
-- ============================================
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('1', 'numbers', '1', '1', 'One', '1️⃣', '/wʌn/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw line"},{"step":2,"label":"Add serif"},{"step":3,"label":"Add base"},{"step":4,"label":"Color it"}]'),
  ('2', 'numbers', '2', '2', 'Two', '2️⃣', '/tuː/', '#5c9ce6', '#e3f2fd', 2, '[{"step":1,"label":"Draw curve"},{"step":2,"label":"Add base"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('3', 'numbers', '3', '3', 'Three', '3️⃣', '/θriː/', '#2e7d32', '#e8f5e9', 3, '[{"step":1,"label":"Draw curves"},{"step":2,"label":"Connect"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('4', 'numbers', '4', '4', 'Four', '4️⃣', '/fɔːr/', '#f5a623', '#fff3e0', 4, '[{"step":1,"label":"Draw vertical"},{"step":2,"label":"Add crossbar"},{"step":3,"label":"Add base"},{"step":4,"label":"Color it"}]'),
  ('5', 'numbers', '5', '5', 'Five', '5️⃣', '/faɪv/', '#9575cd', '#ede7f6', 5, '[{"step":1,"label":"Draw top"},{"step":2,"label":"Add curve"},{"step":3,"label":"Add base"},{"step":4,"label":"Color it"}]'),
  ('10', 'numbers', '10', '10', 'Ten', '🔟', '/ten/', '#e57373', '#ffebee', 6, '[{"step":1,"label":"Draw 1"},{"step":2,"label":"Draw 0"},{"step":3,"label":"Align"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 13. SEED DATA: VEHICLES ITEMS
-- ============================================
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('car', 'vehicles', 'car', 'Car', 'Car', '🚗', '/kɑːr/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wheels"},{"step":3,"label":"Add windows"},{"step":4,"label":"Color it"}]'),
  ('train', 'vehicles', 'train', 'Train', 'Train', '🚂', '/treɪn/', '#5c9ce6', '#e3f2fd', 2, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wheels"},{"step":3,"label":"Add smokestack"},{"step":4,"label":"Color it"}]'),
  ('airplane', 'vehicles', 'airplane', 'Airplane', 'Airplane', '✈️', '/ˈer.pleɪn/', '#9575cd', '#ede7f6', 3, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wings"},{"step":3,"label":"Add tail"},{"step":4,"label":"Color it"}]'),
  ('boat', 'vehicles', 'boat', 'Boat', 'Boat', '⛵', '/boʊt/', '#5c9ce6', '#e3f2fd', 4, '[{"step":1,"label":"Draw hull"},{"step":2,"label":"Add sail"},{"step":3,"label":"Add mast"},{"step":4,"label":"Color it"}]'),
  ('bus', 'vehicles', 'bus', 'Bus', 'Bus', '🚌', '/bʌs/', '#f5a623', '#fff3e0', 5, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wheels"},{"step":3,"label":"Add windows"},{"step":4,"label":"Color it"}]'),
  ('bicycle', 'vehicles', 'bicycle', 'Bicycle', 'Bicycle', '🚲', '/ˈbaɪ.sɪ.kəl/', '#2e7d32', '#e8f5e9', 6, '[{"step":1,"label":"Draw wheels"},{"step":2,"label":"Add frame"},{"step":3,"label":"Add handlebars"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;
