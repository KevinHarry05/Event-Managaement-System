-- Insert event categories
INSERT INTO public.event_categories (name, description, color, icon) VALUES
  ('Technology', 'Tech conferences, workshops, and meetups', '#3B82F6', 'laptop'),
  ('Music', 'Concerts, festivals, and music events', '#EF4444', 'music'),
  ('Sports', 'Sports events, tournaments, and fitness', '#10B981', 'trophy'),
  ('Food & Drink', 'Food festivals, wine tastings, and culinary events', '#F59E0B', 'utensils'),
  ('Business', 'Networking, conferences, and professional events', '#8B5CF6', 'briefcase'),
  ('Arts & Culture', 'Art exhibitions, theater, and cultural events', '#EC4899', 'palette'),
  ('Education', 'Workshops, seminars, and learning events', '#06B6D4', 'book-open'),
  ('Health & Wellness', 'Fitness, yoga, and wellness events', '#84CC16', 'heart')
ON CONFLICT (name) DO NOTHING;

-- Insert sample profiles (replace UUIDs with actual auth.users IDs when available)
INSERT INTO public.profiles (id, email, full_name, role, bio, location) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@eventhub.com', 'Admin User', 'admin', 'Platform administrator', 'San Francisco, CA'),
  ('00000000-0000-0000-0000-000000000002', 'sarah.organizer@example.com', 'Sarah Johnson', 'organizer', 'Event organizer specializing in tech conferences and workshops', 'New York, NY'),
  ('00000000-0000-0000-0000-000000000003', 'mike.user@example.com', 'Mike Chen', 'user', 'Tech enthusiast and event attendee', 'Austin, TX'),
  ('00000000-0000-0000-0000-000000000004', 'emma.organizer@example.com', 'Emma Davis', 'organizer', 'Music event organizer and festival curator', 'Los Angeles, CA'),
  ('00000000-0000-0000-0000-000000000005', 'alex.user@example.com', 'Alex Rodriguez', 'user', 'Fitness enthusiast and wellness advocate', 'Miami, FL')
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO public.events (title, description, date, time, end_time, location, capacity, price, category_id, organizer_id, tags, check_in_code) VALUES
  (
    'AI & Machine Learning Summit 2024',
    'Join industry leaders and experts for a comprehensive exploration of the latest trends in artificial intelligence and machine learning. This summit features keynote speakers, hands-on workshops, and networking opportunities.',
    '2024-03-15',
    '09:00',
    '18:00',
    'Moscone Center, San Francisco',
    500,
    299.00,
    (SELECT id FROM public.event_categories WHERE name = 'Technology'),
    '00000000-0000-0000-0000-000000000002',
    ARRAY['AI', 'Machine Learning', 'Technology', 'Conference'],
    'AI2024SF'
  ),
  (
    'Summer Music Festival',
    'Three days of incredible music featuring top artists from around the world. Food trucks, art installations, and camping available.',
    '2024-06-20',
    '14:00',
    '23:00',
    'Golden Gate Park, San Francisco',
    5000,
    149.00,
    (SELECT id FROM public.event_categories WHERE name = 'Music'),
    '00000000-0000-0000-0000-000000000004',
    ARRAY['Music', 'Festival', 'Outdoor', 'Summer'],
    'MUSIC2024'
  ),
  (
    'Startup Pitch Competition',
    'Watch innovative startups pitch their ideas to a panel of investors. Network with entrepreneurs and industry professionals.',
    '2024-04-10',
    '18:00',
    '21:00',
    'TechCrunch Disrupt Stage, SF',
    200,
    0.00,
    (SELECT id FROM public.event_categories WHERE name = 'Business'),
    '00000000-0000-0000-0000-000000000002',
    ARRAY['Startup', 'Pitch', 'Networking', 'Free'],
    'PITCH2024'
  ),
  (
    'Gourmet Food & Wine Tasting',
    'Experience exquisite cuisine paired with premium wines. Meet renowned chefs and learn about wine pairing techniques.',
    '2024-05-05',
    '19:00',
    '22:00',
    'Napa Valley Wine Country',
    80,
    125.00,
    (SELECT id FROM public.event_categories WHERE name = 'Food & Drink'),
    '00000000-0000-0000-0000-000000000004',
    ARRAY['Food', 'Wine', 'Tasting', 'Gourmet'],
    'WINE2024'
  ),
  (
    'Marathon Training Workshop',
    'Comprehensive training session for marathon preparation. Includes nutrition guidance, training plans, and injury prevention.',
    '2024-04-20',
    '08:00',
    '12:00',
    'Central Park, New York',
    100,
    45.00,
    (SELECT id FROM public.event_categories WHERE name = 'Sports'),
    '00000000-0000-0000-0000-000000000002',
    ARRAY['Marathon', 'Training', 'Fitness', 'Health'],
    'RUN2024'
  ),
  (
    'Contemporary Art Exhibition Opening',
    'Opening night for our latest contemporary art exhibition featuring emerging and established artists.',
    '2024-03-30',
    '18:00',
    '21:00',
    'Museum of Modern Art, NYC',
    300,
    25.00,
    (SELECT id FROM public.event_categories WHERE name = 'Arts & Culture'),
    '00000000-0000-0000-0000-000000000004',
    ARRAY['Art', 'Exhibition', 'Contemporary', 'Culture'],
    'ART2024'
  )
ON CONFLICT DO NOTHING;

-- Insert sample registrations
INSERT INTO public.registrations (event_id, user_id, status) VALUES
  ((SELECT id FROM public.events WHERE title = 'AI & Machine Learning Summit 2024'), '00000000-0000-0000-0000-000000000003', 'confirmed'),
  ((SELECT id FROM public.events WHERE title = 'Summer Music Festival'), '00000000-0000-0000-0000-000000000003', 'confirmed'),
  ((SELECT id FROM public.events WHERE title = 'Startup Pitch Competition'), '00000000-0000-0000-0000-000000000005', 'confirmed'),
  ((SELECT id FROM public.events WHERE title = 'Marathon Training Workshop'), '00000000-0000-0000-0000-000000000005', 'confirmed')
ON CONFLICT DO NOTHING;

-- Insert sample feedback
INSERT INTO public.feedback (event_id, user_id, rating, comment) VALUES
  ((SELECT id FROM public.events WHERE title = 'AI & Machine Learning Summit 2024'), '00000000-0000-0000-0000-000000000003', 5, 'Incredible event! The speakers were world-class and the networking opportunities were amazing.'),
  ((SELECT id FROM public.events WHERE title = 'Summer Music Festival'), '00000000-0000-0000-0000-000000000003', 4, 'Great lineup and atmosphere. The food options could be improved but overall fantastic experience.')
ON CONFLICT DO NOTHING;

-- Insert sample follows
INSERT INTO public.follows (follower_id, following_id) VALUES
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;
