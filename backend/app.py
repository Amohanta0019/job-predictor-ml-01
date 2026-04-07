from flask import Flask, request, jsonify
from flask_cors import CORS
import sys, os, numpy as np, pandas as pd

# ── Path setup ─────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR  = os.path.join(BASE_DIR, 'src')
DATA_DIR = os.path.join(BASE_DIR, 'data')
sys.path.insert(0, SRC_DIR)

from quiz_preprocessing import (load_quiz_data, preprocess_quiz_data,
                                 split_quiz_features_target, split_quiz_train_test,
                                 SKILL_COLUMNS, SKILL_LEVEL_MAP)
from quiz_model import train_quiz_model
from quiz_predict import predict_from_quiz
from career_info import load_career_info, get_career_path
from data_preprocessing import (load_data, clean_data, encode_data,
                                  split_features_target, split_train_test)
from train_model import train_model

app = Flask(__name__)
CORS(app)

# ── SKILL_IMPROVEMENT defined here — BEFORE routes ────────────
SKILL_IMPROVEMENT = {
    'Database Administrator':          ['SQL', 'PostgreSQL', 'Data Modeling', 'Query Optimization'],
    'Software Developer':              ['Data Structures', 'System Design', 'Git', 'Testing'],
    'Data Scientist':                  ['Python', 'Statistics', 'Machine Learning', 'Visualization'],
    'AI ML Specialist':                ['Deep Learning', 'PyTorch', 'Mathematics', 'Research Papers'],
    'Cyber Security Specialist':       ['Ethical Hacking', 'Network Security', 'SIEM Tools', 'CTF'],
    'Networking Engineer':             ['Cisco', 'TCP/IP', 'Routing Protocols', 'Firewalls'],
    'Project Manager':                 ['Agile', 'Scrum', 'Risk Management', 'Communication'],
    'Business Analyst':                ['Requirements Gathering', 'UML', 'Excel', 'Stakeholder Mgmt'],
    'Graphics Designer':               ['Figma', 'Adobe Suite', 'UI Principles', 'Color Theory'],
    'Technical Writer':                ['Documentation', 'Markdown', 'API Writing', 'Clarity'],
    'Software tester':                 ['Selenium', 'Test Cases', 'Bug Reporting', 'Automation'],
    'API Specialist':                  ['REST', 'Postman', 'OpenAPI', 'Authentication'],
    'Hardware Engineer':               ['Circuit Design', 'Embedded Systems', 'VHDL', 'PCB Design'],
    'Helpdesk Engineer':               ['Troubleshooting', 'ITIL', 'Customer Support', 'Documentation'],
    'Application Support Engineer':    ['Debugging', 'SQL', 'Linux', 'Monitoring Tools'],
    'Information Security Specialist': ['Risk Assessment', 'Compliance', 'Encryption', 'Auditing'],
    'Customer Service Executive':      ['Communication', 'CRM Tools', 'Empathy', 'Problem Solving'],
}

# ── Train quiz model ───────────────────────────────────────────
print("Training quiz model...")
quiz_df     = load_quiz_data(os.path.join(DATA_DIR, 'dataset9000.csv'))
quiz_df     = preprocess_quiz_data(quiz_df)
qX, qy      = split_quiz_features_target(quiz_df)
qX_tr, qX_te, qy_tr, qy_te = split_quiz_train_test(qX, qy)
quiz_model  = train_quiz_model(qX_tr, qy_tr)
career_map  = load_career_info(os.path.join(DATA_DIR, 'Career_Dataset.xlsx'))
print("Quiz model ready!")

# ── Train marks model ──────────────────────────────────────────
print("Training marks model...")
marks_df = load_data(os.path.join(DATA_DIR, 'career_pred.csv'))
marks_df = clean_data(marks_df)
marks_df, encoding_maps = encode_data(marks_df)
mX, my   = split_features_target(marks_df)
mX_tr, mX_te, my_tr, my_te = split_train_test(mX, my)
marks_model = train_model(mX_tr, my_tr)
print("Marks model ready!")

# ── Routes ─────────────────────────────────────────────────────
@app.route('/api/quiz', methods=['POST'])
def quiz_predict():
    user_answers = request.json.get('answers', {})
    results = predict_from_quiz(quiz_model, user_answers, k=3)
    output  = []
    for role, prob in results:
        category, skills = get_career_path(role, career_map)
        improve = SKILL_IMPROVEMENT.get(role, [])
        output.append({
            'role':          role,
            'probability':   round(float(prob) * 100, 2),
            'career_path':   category or 'General IT',
            'skills_needed': skills[:6],
            'improve':       improve,
        })
    return jsonify({'predictions': output})

@app.route('/api/marks', methods=['POST'])
def marks_predict():
    user_marks = request.json.get('marks', {})
    encoded = {}
    for col in mX.columns:
        val = user_marks.get(col, '')
        if col in encoding_maps:
            reverse_map = {v: k for k, v in encoding_maps[col].items()}
            encoded[col] = reverse_map.get(str(val), 0)
        else:
            try:
                encoded[col] = float(val)
            except (ValueError, TypeError):
                encoded[col] = 0.0

    input_df = pd.DataFrame([encoded])[mX.columns]
    probs    = marks_model.predict_proba(input_df)
    top3_idx = np.argsort(probs, axis=1)[:, -3:][:, ::-1]
    top3_prb = np.take_along_axis(probs, top3_idx, axis=1)
    classes  = marks_model.classes_

    target_col      = 'Suggested Job Role'
    role_decode_map = encoding_maps.get(target_col, {})

    output = []
    for idx, prob in zip(top3_idx[0], top3_prb[0]):
        encoded_label = classes[idx]
        role = role_decode_map.get(int(encoded_label), str(encoded_label))
        output.append({
            'role':        role,
            'probability': round(float(prob) * 100, 2),
            'improve':     SKILL_IMPROVEMENT.get(role, []),
        })
    return jsonify({'predictions': output})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)