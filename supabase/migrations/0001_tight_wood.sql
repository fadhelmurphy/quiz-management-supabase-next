/*
  # Initial Schema Setup for Quiz Builder

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `username` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `quizzes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `user_id` (uuid) - References profiles
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `questions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid) - References quizzes
      - `question_text` (text)
      - `options` (jsonb) - Array of options
      - `correct_answer` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `quiz_attempts`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid) - References quizzes
      - `user_id` (uuid) - References profiles
      - `score` (integer)
      - `answers` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL,
  answers jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Quizzes policies
CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quizzes"
  ON quizzes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quizzes"
  ON quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert questions to their own quizzes"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE id = quiz_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions in their own quizzes"
  ON questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE id = quiz_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions from their own quizzes"
  ON questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE id = quiz_id AND user_id = auth.uid()
    )
  );

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);