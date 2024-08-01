from flask import Flask
from flask_cors import CORS
from routes import create_routes

app = Flask(__name__)
CORS(app)  # Permitir todas las solicitudes CORS

create_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
