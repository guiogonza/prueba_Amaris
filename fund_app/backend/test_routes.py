from flask import Flask, request, jsonify

def create_routes(app):
    @app.route('/subscribe', methods=['POST'])
    def subscribe():
        data = request.get_json()
        # Lógica para suscribir
        return jsonify({'transaction_id': 'abc123'}), 200

    @app.route('/unsubscribe', methods=['POST'])
    def unsubscribe():
        data = request.get_json()
        # Lógica para desuscribir
        return jsonify({'transaction_id': 'xyz456'}), 200

    @app.route('/transactions', methods=['GET'])
    def transactions():
        client_id = request.args.get('client_id')
        # Lógica para obtener transacciones
        return jsonify([]), 200

    @app.route('/clients', methods=['GET'])
    def clients():
        # Lógica para obtener clientes
        return jsonify([]), 200

    @app.route('/funds', methods=['GET'])
    def funds():
        # Lógica para obtener fondos
        return jsonify([]), 200

    @app.route('/upload_clients', methods=['POST'])
    def upload_clients():
        # Lógica para cargar clientes
        return jsonify({'status': 'success'}), 200

    @app.route('/all_transactions', methods=['GET'])
    def all_transactions():
        # Lógica para obtener todas las transacciones
        return jsonify([]), 200

    @app.route('/client_funds', methods=['GET'])
    def client_funds():
        client_id = request.args.get('client_id')
        # Lógica para obtener fondos del cliente
        return jsonify([]), 200

    @app.route('/client/<client_id>', methods=['DELETE'])
    def delete_client(client_id):
        # Lógica para eliminar cliente
        return jsonify({'status': 'deleted'}), 200

    @app.route('/client', methods=['POST'])
    def create_client():
        data = request.get_json()
        # Lógica para crear cliente
        return jsonify({'client_id': 'new_id'}), 201

    @app.route('/transaction/<transaction_id>', methods=['DELETE'])
    def delete_transaction(transaction_id):
        # Lógica para eliminar transacción
        return jsonify({'status': 'deleted'}), 200
