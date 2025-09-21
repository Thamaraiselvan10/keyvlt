# keyvlt-backend/app.py

import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import click

# Imports for Authentication and Database Migrations (kept for future use)
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_migrate import Migrate

# --- App Configuration ---
app = Flask(__name__)

# Explicit CORS setup for development
cors = CORS(app, resources={
  r"/*": {
    "origins": "*" # Allow all origins
  }
})

app.config['SECRET_KEY'] = 'your-super-secret-key-for-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///keyvlt.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'another-super-secret-key'

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

db = SQLAlchemy(app)
# Initialize JWT and Migrate (kept for future use)
jwt = JWTManager(app)
migrate = Migrate(app, db)


# --- Database Models ---

# User Model (kept for future use)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    files = db.relationship('ContentKeys', backref='owner', lazy=True)

class ContentKeys(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # MODIFIED: user_id is now optional (nullable=True) for anonymous uploads
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
   
    key_name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(200), nullable=False)
    original_filename = db.Column(db.String(200), nullable=False)
    secure_filename = db.Column(db.String(200), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    password_hash = db.Column(db.String(200), nullable=True)
    expires_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# --- API Routes ---

# Registration Endpoint (Temporarily Disabled)
# @app.route('/register', methods=['POST'])
# def register():
#     # ... (code is disabled)

# Login Endpoint (Temporarily Disabled)
# @app.route('/login', methods=['POST'])
# def login():
#     # ... (code is disabled)


# MODIFIED: Upload is now a PUBLIC route
@app.route('/upload', methods=['POST'])
# @jwt_required() # Decorator is commented out to make it public
def upload():
    try:
        uploaded_file = request.files.get('file')
        key_name = request.form.get('key_name')
        display_name = request.form.get('display_name')
        password = request.form.get('password')
        expires_at_str = request.form.get('expires_at')

        if not all([uploaded_file, key_name, display_name]):
            return jsonify({'error': 'File, Key-Name, and Display Name are required.'}), 400
        if ContentKeys.query.filter_by(key_name=key_name).first():
            return jsonify({'error': f"The key-name '{key_name}' is already taken."}), 400

        password_hash = generate_password_hash(password) if password else None
        expires_at = datetime.fromisoformat(expires_at_str) if expires_at_str else None
        
        original_filename = os.path.basename(uploaded_file.filename)
        unique_filename = str(uuid.uuid4()) + os.path.splitext(original_filename)[1]
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        uploaded_file.save(file_path)
        file_size = os.path.getsize(file_path)

        # Create the new entry WITHOUT a user_id
        new_entry = ContentKeys(
            key_name=key_name,
            display_name=display_name,
            original_filename=original_filename,
            secure_filename=unique_filename,
            file_size=file_size,
            password_hash=password_hash,
            expires_at=expires_at
        )
        
        db.session.add(new_entry)
        db.session.commit()

        return jsonify({'success': True, 'message': 'File uploaded successfully!', 'key_name': key_name}), 200

    except Exception as e:
        # It's helpful to print the error to the console for debugging
        print(f"An error occurred during upload: {e}")
        return jsonify({'error': 'An internal error occurred during upload.'}), 500


# Public /info and /download routes
@app.route('/info/<key_name>', methods=['GET'])
def get_info(key_name):
    entry = ContentKeys.query.filter_by(key_name=key_name).first()
    if not entry:
        return jsonify({'error': 'File not found.'}), 404
    if entry.expires_at and datetime.utcnow() > entry.expires_at:
        return jsonify({'error': 'This key has expired.'}), 404
    return jsonify({
        'key_name': entry.key_name,
        'display_name': entry.display_name,
        'original_filename': entry.original_filename,
        'file_size': entry.file_size,
        'has_password': bool(entry.password_hash),
        'expires_at': entry.expires_at.isoformat() if entry.expires_at else None,
        'created_at': entry.created_at.isoformat(),
    }), 200

@app.route('/download/<key_name>', methods=['POST'])
def download(key_name):
    entry = ContentKeys.query.filter_by(key_name=key_name).first()
    if not entry:
        return jsonify({'error': 'File not found.'}), 404
    if entry.expires_at and datetime.utcnow() > entry.expires_at:
        return jsonify({'error': 'This key has expired.'}), 404
    password = request.json.get('password', '')
    if entry.password_hash and not check_password_hash(entry.password_hash, password):
        return jsonify({'error': 'Incorrect password.'}), 403
    try:
        return send_from_directory(
            app.config['UPLOAD_FOLDER'],
            entry.secure_filename,
            as_attachment=True,
            download_name=entry.original_filename
        )
    except FileNotFoundError:
        abort(500, description="File data is missing on the server.")