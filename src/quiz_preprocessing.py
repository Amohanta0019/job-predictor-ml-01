import pandas as pd
from sklearn.model_selection import train_test_split

# Ordinal scale — order matters here, so we map manually instead of factorize
SKILL_LEVEL_MAP = {
    'Not Interested': 0,
    'Poor':           1,
    'Beginner':       2,
    'Average':        3,
    'Intermediate':   4,
    'Excellent':      5,
    'Professional':   6
}

SKILL_COLUMNS = [
    'Database Fundamentals', 'Computer Architecture',
    'Distributed Computing Systems', 'Cyber Security', 'Networking',
    'Software Development', 'Programming Skills', 'Project Management',
    'Computer Forensics Fundamentals', 'Technical Communication',
    'AI ML', 'Software Engineering', 'Business Analysis',
    'Communication skills', 'Data Science', 'Troubleshooting skills',
    'Graphics Designing'
]

def load_quiz_data(path=r'..\data\dataset9000.csv'):
    return pd.read_csv(path)

def preprocess_quiz_data(df):
    df = df.copy()
    df.columns = df.columns.str.strip()
    # Use ordinal encoding (order matters: Professional > Excellent > ... > Not Interested)
    for col in SKILL_COLUMNS:
        df[col] = df[col].map(SKILL_LEVEL_MAP)
    df = df.dropna()
    return df

def split_quiz_features_target(df, target='Role'):
    X = df[SKILL_COLUMNS]
    y = df[target]
    return X, y

def split_quiz_train_test(X, y, test_size=0.2, random_state=42):
    return train_test_split(X, y, test_size=test_size,
                            random_state=random_state, stratify=y)