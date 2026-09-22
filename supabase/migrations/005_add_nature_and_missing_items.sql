-- Add nature category
INSERT INTO categories (id, name, description, emoji, color, sort_order, is_recommended)
VALUES ('nature', 'Nature', 'Trees, flowers & sunshine', '🌸', '#4caf50', 7, false)
ON CONFLICT (id) DO NOTHING;

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage settings" ON admin_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed default settings
INSERT INTO admin_settings (key, value) VALUES
  ('platform_name', 'Draw Kao'),
  ('tagline', 'Learn Through Drawing'),
  ('support_email', 'support@drawkao.com'),
  ('email_notifications', 'true'),
  ('weekly_reports', 'true'),
  ('new_user_alerts', 'false'),
  ('email_verification', 'true'),
  ('two_factor', 'false'),
  ('session_timeout', '60')
ON CONFLICT (key) DO NOTHING;

-- Add missing alphabet items (only letters not already seeded)
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, sort_order, drawing_steps)
VALUES
  ('letter_g', 'alphabet', 'g', 'G is for Grapes', 'grapes', '🍇', 'Guh', '#7b1fa2', 7, '[]'),
  ('letter_h', 'alphabet', 'h', 'H is for House', 'house', '🏠', 'Huh', '#5d4037', 8, '[]'),
  ('letter_i', 'alphabet', 'i', 'I is for Igloo', 'igloo', '🏔️', 'Ih', '#0288d1', 9, '[]'),
  ('letter_j', 'alphabet', 'j', 'J is for Jellyfish', 'jellyfish', '🪼', 'Juh', '#e91e63', 10, '[]'),
  ('letter_k', 'alphabet', 'k', 'K is for Kite', 'kite', '🪁', 'Kuh', '#ff9800', 11, '[]'),
  ('letter_l', 'alphabet', 'l', 'L is for Lion', 'lion', '🦁', 'Luh', '#f57c00', 12, '[]'),
  ('letter_m', 'alphabet', 'm', 'M is for Moon', 'moon', '🌙', 'Muh', '#5c6bc0', 13, '[]'),
  ('letter_n', 'alphabet', 'n', 'N is for Nest', 'nest', '🪹', 'Nuh', '#6d4c41', 14, '[]'),
  ('letter_o', 'alphabet', 'o', 'O is for Orange', 'orange', '🍊', 'Oh', '#ef6c00', 15, '[]'),
  ('letter_p', 'alphabet', 'p', 'P is for Penguin', 'penguin', '🐧', 'Puh', '#37474f', 16, '[]'),
  ('letter_q', 'alphabet', 'q', 'Q is for Queen', 'queen', '👑', 'Kwuh', '#ffd600', 17, '[]'),
  ('letter_r', 'alphabet', 'r', 'R is for Rainbow', 'rainbow', '🌈', 'Ruh', '#e91e63', 18, '[]'),
  ('letter_s', 'alphabet', 's', 'S is for Sun', 'sun', '☀️', 'Suh', '#ff8f00', 19, '[]'),
  ('letter_t', 'alphabet', 't', 'T is for Turtle', 'turtle', '🐢', 'Tuh', '#2e7d32', 20, '[]'),
  ('letter_u', 'alphabet', 'u', 'U is for Umbrella', 'umbrella', '☂️', 'Uh', '#1565c0', 21, '[]'),
  ('letter_v', 'alphabet', 'v', 'V is for Violin', 'violin', '🎻', 'Vuh', '#6a1b9a', 22, '[]'),
  ('letter_w', 'alphabet', 'w', 'W is for Whale', 'whale', '🐋', 'Wuh', '#0277bd', 23, '[]'),
  ('letter_x', 'alphabet', 'x', 'X is for Xylophone', 'xylophone', '🎵', 'Ksuh', '#c62828', 24, '[]'),
  ('letter_y', 'alphabet', 'y', 'Y is for Yak', 'yak', '🐃', 'Yuh', '#5d4037', 25, '[]'),
  ('letter_z', 'alphabet', 'z', 'Z is for Zebra', 'zebra', '🦓', 'Zuh', '#37474f', 26, '[]')
ON CONFLICT (id) DO NOTHING;

-- Add missing numbers 6-9, 11-19
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, sort_order, drawing_steps)
VALUES
  ('number_6', 'numbers', '6', 'Number 6', 'six', '6️⃣', 'Six', '#e57373', 6, '[]'),
  ('number_7', 'numbers', '7', 'Number 7', 'seven', '7️⃣', 'Seven', '#5c9ce6', 7, '[]'),
  ('number_8', 'numbers', '8', 'Number 8', 'eight', '8️⃣', 'Eight', '#2e7d32', 8, '[]'),
  ('number_9', 'numbers', '9', 'Number 9', 'nine', '9️⃣', 'Nine', '#9575cd', 9, '[]'),
  ('number_11', 'numbers', '11', 'Number 11', 'eleven', '1️⃣1️⃣', 'Eleven', '#f5a623', 11, '[]'),
  ('number_12', 'numbers', '12', 'Number 12', 'twelve', '1️⃣2️⃣', 'Twelve', '#e57373', 12, '[]'),
  ('number_13', 'numbers', '13', 'Number 13', 'thirteen', '1️⃣3️⃣', 'Thirteen', '#5c9ce6', 13, '[]'),
  ('number_14', 'numbers', '14', 'Number 14', 'fourteen', '1️⃣4️⃣', 'Fourteen', '#2e7d32', 14, '[]'),
  ('number_15', 'numbers', '15', 'Number 15', 'fifteen', '1️⃣5️⃣', 'Fifteen', '#9575cd', 15, '[]'),
  ('number_16', 'numbers', '16', 'Number 16', 'sixteen', '1️⃣6️⃣', 'Sixteen', '#f5a623', 16, '[]'),
  ('number_17', 'numbers', '17', 'Number 17', 'seventeen', '1️⃣7️⃣', 'Seventeen', '#e57373', 17, '[]'),
  ('number_18', 'numbers', '18', 'Number 18', 'eighteen', '1️⃣8️⃣', 'Eighteen', '#5c9ce6', 18, '[]'),
  ('number_19', 'numbers', '19', 'Number 19', 'nineteen', '1️⃣9️⃣', 'Nineteen', '#2e7d32', 19, '[]')
ON CONFLICT (id) DO NOTHING;

-- Add nature items
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, sort_order, drawing_steps)
VALUES
  ('nature_tree', 'nature', 'tree', 'Tree', 'tree', '🌳', 'Tree', '#2e7d32', 1, '[]'),
  ('nature_flower', 'nature', 'flower', 'Flower', 'flower', '🌸', 'Flower', '#e91e63', 2, '[]'),
  ('nature_sun', 'nature', 'sun', 'Sun', 'sun', '☀️', 'Sun', '#ff8f00', 3, '[]'),
  ('nature_moon', 'nature', 'moon', 'Moon', 'moon', '🌙', 'Moon', '#5c6bc0', 4, '[]'),
  ('nature_cloud', 'nature', 'cloud', 'Cloud', 'cloud', '☁️', 'Cloud', '#90a4ae', 5, '[]'),
  ('nature_rainbow', 'nature', 'rainbow', 'Rainbow', 'rainbow', '🌈', 'Rainbow', '#e91e63', 6, '[]')
ON CONFLICT (id) DO NOTHING;
