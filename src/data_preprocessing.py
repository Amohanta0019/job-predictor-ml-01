import pandas as pd
from sklearn.model_selection import train_test_split

DATA_PATH = r'e:\Project_FinalYr\job_portal\data\career_pred.csv'

def load_data(path=DATA_PATH):
    return pd.read_csv(path)

def clean_data(df):
    df = df.dropna()
    df.columns = df.columns.str.strip()
    return df

def encode_data(df):
    df = df.copy()
    encoding_maps = {}  # store the mapping for every encoded column
    
    for col in df.select_dtypes(include='object').columns:
        codes, uniques = pd.factorize(df[col])
        df[col] = codes
        encoding_maps[col] = {i: label for i, label in enumerate(uniques)}
    
    return df, encoding_maps

def split_features_target(df, target='Suggested Job Role'):
    X = df.drop(target, axis=1)
    y = df[target]
    return X, y

def split_train_test(X, y, test_size=0.2, random_state=42):
    return train_test_split(X, y, test_size=test_size,
                            random_state=random_state, stratify=y)