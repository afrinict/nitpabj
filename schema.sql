-- Create enums
CREATE TYPE user_role AS ENUM ('member', 'admin', 'financial_officer', 'ethics_officer', 'executive', 'instructor');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE member_grade AS ENUM ('student', 'associate', 'full', 'fellow');
CREATE TYPE education_level AS ENUM ('bachelors', 'masters', 'phd', 'postdoc', 'other');
CREATE TYPE complaint_status AS ENUM ('received', 'under_review', 'resolved', 'dismissed');
CREATE TYPE application_type AS ENUM ('sar', 'eiar');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'completed', 'dropped');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    membership_number TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Create profiles table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number TEXT,
    address TEXT,
    date_of_birth DATE,
    gender gender,
    nationality TEXT,
    state TEXT,
    bio TEXT,
    profile_picture TEXT,
    membership_grade member_grade,
    research_interests TEXT,
    is_executive BOOLEAN DEFAULT FALSE,
    executive_position TEXT,
    executive_bio TEXT
);

-- Create qualifications table
CREATE TABLE qualifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level education_level NOT NULL,
    institution TEXT NOT NULL,
    qualification TEXT NOT NULL,
    year_obtained INTEGER NOT NULL,
    certificate TEXT,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Create publications table
CREATE TABLE publications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    publisher TEXT NOT NULL,
    year INTEGER NOT NULL,
    url TEXT,
    description TEXT
);

-- Create complaints table
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    complainant_id INTEGER REFERENCES users(id),
    respondent_id INTEGER REFERENCES users(id),
    non_member_name TEXT,
    non_member_email TEXT,
    non_member_phone TEXT,
    subject TEXT NOT NULL,
    details TEXT NOT NULL,
    supporting_documents TEXT,
    status complaint_status NOT NULL DEFAULT 'received',
    assigned_officer_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type application_type NOT NULL,
    project_name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    state TEXT NOT NULL,
    lga TEXT NOT NULL,
    address TEXT NOT NULL,
    documents JSONB,
    status application_status NOT NULL DEFAULT 'draft',
    certificate_number TEXT,
    certificate_url TEXT,
    payment_amount NUMERIC(10,2),
    payment_status BOOLEAN DEFAULT FALSE,
    payment_reference TEXT,
    additional_info JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create financial_records table
CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    transaction_type TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    reference_number TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructor_id INTEGER NOT NULL REFERENCES users(id),
    status course_status NOT NULL DEFAULT 'draft',
    thumbnail TEXT,
    duration INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    status enrollment_status NOT NULL DEFAULT 'enrolled',
    progress INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create elections table
CREATE TABLE elections (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_rooms table
CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create member_tools table
CREATE TABLE member_tools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    tool_url TEXT NOT NULL,
    credits_per_hour INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create member_credits table
CREATE TABLE member_credits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    balance INTEGER NOT NULL DEFAULT 0,
    total_purchased INTEGER NOT NULL DEFAULT 0,
    total_used INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create credit_transactions table
CREATE TABLE credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    tool_id INTEGER REFERENCES member_tools(id),
    payment_reference TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); 