-- Create tables for Mohamed Al-Fateh School

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    shift VARCHAR(1) NOT NULL CHECK (shift IN ('A', 'B')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
    name VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO grades (name, shift) VALUES
    ('الصف الأول', 'A'),
    ('الصف الثاني', 'A'),
    ('الصف الثالث', 'A'),
    ('الصف الرابع', 'A'),
    ('الصف الخامس', 'A'),
    ('الصف السادس', 'A'),
    ('الصف الأول', 'B'),
    ('الصف الثاني', 'B'),
    ('الصف الثالث', 'B'),
    ('الصف الرابع', 'B'),
    ('الصف الخامس', 'B'),
    ('الصف السادس', 'B')
ON CONFLICT DO NOTHING;

-- Insert sections for each grade
INSERT INTO sections (grade_id, name)
SELECT g.id, 'أ'
FROM grades g
ON CONFLICT DO NOTHING;

INSERT INTO sections (grade_id, name)
SELECT g.id, 'ب'
FROM grades g
WHERE g.name IN ('الصف الرابع', 'الصف الخامس', 'الصف السادس')
ON CONFLICT DO NOTHING;

-- Create storage bucket for schedule images
INSERT INTO storage.buckets (id, name, public) VALUES ('schedules', 'schedules', true)
ON CONFLICT DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on grades" ON grades
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on sections" ON sections
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on schedules" ON schedules
    FOR SELECT USING (true);

-- Create policies for admin access
CREATE POLICY "Allow admin full access on grades" ON grades
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow admin full access on sections" ON sections
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow admin full access on schedules" ON schedules
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow admin read access on users" ON users
    FOR SELECT USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

-- Create storage policies
CREATE POLICY "Allow public read access on schedule images" ON storage.objects
    FOR SELECT USING (bucket_id = 'schedules');

CREATE POLICY "Allow admin upload schedule images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'schedules' AND
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow admin update schedule images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'schedules' AND
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Allow admin delete schedule images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'schedules' AND
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for schedules table
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert admin user (you'll need to update this with your actual admin email)
INSERT INTO users (email, role) VALUES ('admin@mohamedalfateh.edu', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
