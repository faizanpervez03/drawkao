-- Seed data for all categories
-- Run this in Supabase SQL Editor if data is missing

-- Categories (skip alphabet since it already exists)
INSERT INTO categories (id, name, description, letters, emoji, color, sort_order, is_recommended)
VALUES
  ('fruits', 'Fruits', 'Apples, bananas & berries', '🍎 🍊 🍌', '🍊', '#e57373', 2, false),
  ('animals', 'Animals', 'Kittens, puppies & jungle friends', '🐱 🐶 🐸', '🐱', '#5c9ce6', 3, false),
  ('shapes', 'Shapes', 'Circles, triangles & patterns', '● ▲ ■', '⬡', '#f5a623', 4, false),
  ('numbers', 'Numbers', 'Trace 1 to 20 & count stars', '1 2 3', '⭐', '#9575cd', 5, false),
  ('vehicles', 'Vehicles', 'Cars, trains & airplanes', '🚗 🚂 ✈️', '🚗', '#e57373', 6, false)
ON CONFLICT (id) DO NOTHING;

-- Fruits items
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('apple', 'fruits', 'apple', 'Apple', 'Apple', '🍎', '/ˈæp.əl/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw outline"},{"step":2,"label":"Add stem"},{"step":3,"label":"Draw leaf"},{"step":4,"label":"Color it"}]'),
  ('banana', 'fruits', 'banana', 'Banana', 'Banana', '🍌', '/bəˈnæn.ə/', '#f5a623', '#fff3e0', 2, '[{"step":1,"label":"Draw curve"},{"step":2,"label":"Add ends"},{"step":3,"label":"Add peel"},{"step":4,"label":"Color it"}]'),
  ('orange', 'fruits', 'orange', 'Orange', 'Orange', '🍊', '/ˈɒr.ɪndʒ/', '#f5a623', '#fff3e0', 3, '[{"step":1,"label":"Draw circle"},{"step":2,"label":"Add dimple"},{"step":3,"label":"Add leaf"},{"step":4,"label":"Color it"}]'),
  ('grape', 'fruits', 'grape', 'Grape', 'Grape', '🍇', '/ɡreɪp/', '#9575cd', '#ede7f6', 4, '[{"step":1,"label":"Draw circles"},{"step":2,"label":"Add stem"},{"step":3,"label":"Add leaf"},{"step":4,"label":"Color it"}]'),
  ('strawberry', 'fruits', 'strawberry', 'Strawberry', 'Strawberry', '🍓', '/ˈstrɔː.bər.i/', '#e57373', '#ffebee', 5, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add seeds"},{"step":3,"label":"Add leaves"},{"step":4,"label":"Color it"}]'),
  ('watermelon', 'fruits', 'watermelon', 'Watermelon', 'Watermelon', '🍉', '/ˈwɔː.tə.mel.ən/', '#2e7d32', '#e8f5e9', 6, '[{"step":1,"label":"Draw slice"},{"step":2,"label":"Add rind"},{"step":3,"label":"Add seeds"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- Animals items
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('cat', 'animals', 'cat', 'Cat', 'Cat', '🐱', '/kæt/', '#f5a623', '#fff3e0', 1, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add ears"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('dog', 'animals', 'dog', 'Dog', 'Dog', '🐶', '/dɒɡ/', '#2e7d32', '#e8f5e9', 2, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add ears"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('fish', 'animals', 'fish', 'Fish', 'Fish', '🐟', '/fɪʃ/', '#5c9ce6', '#e3f2fd', 3, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add tail"},{"step":3,"label":"Add fins"},{"step":4,"label":"Color it"}]'),
  ('lion', 'animals', 'lion', 'Lion', 'Lion', '🦁', '/ˈlaɪ.ən/', '#f5a623', '#fff3e0', 4, '[{"step":1,"label":"Draw head"},{"step":2,"label":"Add mane"},{"step":3,"label":"Draw face"},{"step":4,"label":"Color it"}]'),
  ('elephant', 'animals', 'elephant', 'Elephant', 'Elephant', '🐘', '/ˈel.ɪ.fənt/', '#9575cd', '#ede7f6', 5, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add trunk"},{"step":3,"label":"Add ears"},{"step":4,"label":"Color it"}]'),
  ('bird', 'animals', 'bird', 'Bird', 'Bird', '🐦', '/bɜːrd/', '#5c9ce6', '#e3f2fd', 6, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wings"},{"step":3,"label":"Add beak"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- Shapes items
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('circle', 'shapes', 'circle', 'Circle', 'Circle', '⭕', '/ˈsɜːr.kəl/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw circle"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('square', 'shapes', 'square', 'Square', 'Square', '🟧', '/skwer/', '#f5a623', '#fff3e0', 2, '[{"step":1,"label":"Draw square"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('triangle', 'shapes', 'triangle', 'Triangle', 'Triangle', '🔺', '/ˈtraɪ.æŋ.ɡəl/', '#2e7d32', '#e8f5e9', 3, '[{"step":1,"label":"Draw triangle"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('star_shape', 'shapes', 'star', 'Star', 'Star', '⭐', '/stɑːr/', '#f5a623', '#fff3e0', 4, '[{"step":1,"label":"Draw star"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('heart', 'shapes', 'heart', 'Heart', 'Heart', '❤️', '/hɑːrt/', '#e57373', '#ffebee', 5, '[{"step":1,"label":"Draw heart"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('diamond', 'shapes', 'diamond', 'Diamond', 'Diamond', '💎', '/ˈdaɪ.mənd/', '#5c9ce6', '#e3f2fd', 6, '[{"step":1,"label":"Draw diamond"},{"step":2,"label":"Add outline"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- Numbers items
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('num-1', 'numbers', '1', '1', 'One', '1️⃣', '/wʌn/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw line"},{"step":2,"label":"Add serif"},{"step":3,"label":"Add base"},{"step":4,"label":"Color it"}]'),
  ('num-2', 'numbers', '2', '2', 'Two', '2️⃣', '/tuː/', '#5c9ce6', '#e3f2fd', 2, '[{"step":1,"label":"Draw curve"},{"step":2,"label":"Add base"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('num-3', 'numbers', '3', '3', 'Three', '3️⃣', '/θriː/', '#2e7d32', '#e8f5e9', 3, '[{"step":1,"label":"Draw curves"},{"step":2,"label":"Connect"},{"step":3,"label":"Add details"},{"step":4,"label":"Color it"}]'),
  ('num-4', 'numbers', '4', '4', 'Four', '4️⃣', '/fɔːr/', '#f5a623', '#fff3e0', 4, '[{"step":1,"label":"Draw vertical"},{"step":2,"label":"Add crossbar"},{"step":3,"label":"Add base"},{"step":4,"label":"Color it"}]'),
  ('num-5', 'numbers', '5', '5', 'Five', '5️⃣', '/faɪv/', '#9575cd', '#ede7f6', 5, '[{"step":1,"label":"Draw top"},{"step":2,"label":"Add curve"},{"step":3,"label":"Add base"},{"step":4,"label":"Color it"}]'),
  ('num-10', 'numbers', '10', '10', 'Ten', '🔟', '/ten/', '#e57373', '#ffebee', 6, '[{"step":1,"label":"Draw 1"},{"step":2,"label":"Draw 0"},{"step":3,"label":"Align"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;

-- Vehicles items
INSERT INTO items (id, category_id, slug, label, word, emoji, pronunciation, color, bg_color, sort_order, drawing_steps)
VALUES
  ('car', 'vehicles', 'car', 'Car', 'Car', '🚗', '/kɑːr/', '#e57373', '#ffebee', 1, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wheels"},{"step":3,"label":"Add windows"},{"step":4,"label":"Color it"}]'),
  ('train', 'vehicles', 'train', 'Train', 'Train', '🚂', '/treɪn/', '#5c9ce6', '#e3f2fd', 2, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wheels"},{"step":3,"label":"Add smokestack"},{"step":4,"label":"Color it"}]'),
  ('airplane', 'vehicles', 'airplane', 'Airplane', 'Airplane', '✈️', '/ˈer.pleɪn/', '#9575cd', '#ede7f6', 3, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wings"},{"step":3,"label":"Add tail"},{"step":4,"label":"Color it"}]'),
  ('boat', 'vehicles', 'boat', 'Boat', 'Boat', '⛵', '/boʊt/', '#5c9ce6', '#e3f2fd', 4, '[{"step":1,"label":"Draw hull"},{"step":2,"label":"Add sail"},{"step":3,"label":"Add mast"},{"step":4,"label":"Color it"}]'),
  ('bus', 'vehicles', 'bus', 'Bus', 'Bus', '🚌', '/bʌs/', '#f5a623', '#fff3e0', 5, '[{"step":1,"label":"Draw body"},{"step":2,"label":"Add wheels"},{"step":3,"label":"Add windows"},{"step":4,"label":"Color it"}]'),
  ('bicycle', 'vehicles', 'bicycle', 'Bicycle', 'Bicycle', '🚲', '/ˈbaɪ.sɪ.kəl/', '#2e7d32', '#e8f5e9', 6, '[{"step":1,"label":"Draw wheels"},{"step":2,"label":"Add frame"},{"step":3,"label":"Add handlebars"},{"step":4,"label":"Color it"}]')
ON CONFLICT (id) DO NOTHING;
