-- OpenWatch Database Schema (PostgreSQL)

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'official', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Records table
CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    department VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Archived', 'Under Review')),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_by_name VARCHAR(255) NOT NULL,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by_name VARCHAR(255),
    blockchain_hash VARCHAR(255),
    blockchain_tx VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES records(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW')),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    changes JSONB,
    previous_data JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_records_department ON records(department);
CREATE INDEX idx_records_status ON records(status);
CREATE INDEX idx_records_created_by ON records(created_by);
CREATE INDEX idx_records_created_at ON records(created_at);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Full-text search index for records
CREATE INDEX idx_records_search ON records USING gin(to_tsvector('english', title || ' ' || description));

-- Insert demo users (passwords are hashed version of 'password')
INSERT INTO users (name, email, password, role) VALUES
('Demo Official', 'official@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'official'),
('Demo Admin', 'admin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'admin'),
('Demo Citizen', 'citizen@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'citizen');

-- Insert demo records
INSERT INTO records (title, description, department, status, created_by, created_by_name) VALUES
('City Budget Allocation 2024', 'Detailed breakdown of the city budget allocation for the fiscal year 2024, including infrastructure, education, and public safety spending.', 'Finance', 'Active', 1, 'Demo Official'),
('Public Health Initiative Report', 'Comprehensive report on the new public health initiatives launched in response to community health needs assessment.', 'Health', 'Active', 1, 'Demo Official'),
('Transportation Infrastructure Plan', 'Long-term plan for improving city transportation infrastructure, including road maintenance and public transit expansion.', 'Transportation', 'Under Review', 2, 'Demo Admin'),
('Education System Reform Proposal', 'Proposal for reforming the local education system to improve student outcomes and teacher resources.', 'Education', 'Active', 1, 'Demo Official'),
('Public Safety Annual Report', 'Annual report on public safety metrics, crime statistics, and police department activities.', 'Public Safety', 'Active', 2, 'Demo Admin');

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_records_updated_at BEFORE UPDATE ON records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();