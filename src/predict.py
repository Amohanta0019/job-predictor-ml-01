import numpy as np

def get_top_k_predictions(model, X, k=3):
    probs = model.predict_proba(X)
    top_k_indices = np.argsort(probs, axis=1)[:, -k:][:, ::-1]
    top_k_probs = np.take_along_axis(probs, top_k_indices, axis=1)
    classes = model.classes_
    top_k_labels = classes[top_k_indices]
    return top_k_labels, top_k_probs