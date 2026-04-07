import numpy as np
import pandas as pd
from quiz_preprocessing import SKILL_COLUMNS, SKILL_LEVEL_MAP

def predict_from_quiz(model, user_responses: dict, k=3):
    """
    user_responses: dict like
    {
        'Database Fundamentals': 'Intermediate',
        'Programming Skills': 'Excellent',
        ...
    }
    """
    # Convert text responses to numbers using the same map
    encoded = {col: SKILL_LEVEL_MAP.get(user_responses.get(col, 'Not Interested'), 0)
               for col in SKILL_COLUMNS}

    input_df = pd.DataFrame([encoded])[SKILL_COLUMNS]

    probs = model.predict_proba(input_df)
    top_k_indices = np.argsort(probs, axis=1)[:, -k:][:, ::-1]
    top_k_probs = np.take_along_axis(probs, top_k_indices, axis=1)

    classes = model.classes_
    top_k_labels = classes[top_k_indices[0]]
    top_k_scores = top_k_probs[0]

    return list(zip(top_k_labels, top_k_scores))