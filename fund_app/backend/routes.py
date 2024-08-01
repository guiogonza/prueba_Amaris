from flask import Flask, request, jsonify
from models import clients_table, transactions_table, funds_table, get_fund_details
import uuid
import boto3
from boto3.dynamodb.conditions import Key
from faker import Faker
import requests
from dotenv import load_dotenv
import os
# from twilio.rest import Client as TwilioClient

# Cargar variables de entorno desde el archivo .env
load_dotenv()

fake = Faker()

def create_routes(app):
    @app.route('/subscribe', methods=['POST'])
    def subscribe():
        data = request.get_json()
        client_id = data['client_id']
        fund_id = data['fund_id']
        amount = int(data['amount'])

        try:
            fund_details = get_fund_details(fund_id)
        except ValueError as e:
            return jsonify({'message': str(e)}), 400

        if amount < fund_details['MontoMinimo']:
            return jsonify({'message': f'El monto ingresado es menor al monto mínimo requerido para el fondo {fund_id}.'}), 400

        transaction_id = str(uuid.uuid4())
        transactions_table.put_item(
            Item={
                'TransaccionId': transaction_id,
                'ClientID': client_id,
                'FundID': fund_id,
                'Amount': amount,
                'Type': 'Subscription',
                'Timestamp': fake.date_time_this_year().isoformat()
            }
        )
        notify_subscription(client_id, fund_id, amount, fund_details['Nombre'])
        return jsonify({'transaction_id': transaction_id}), 200

    def notify_subscription(client_id, fund_id, amount, fund_name):
        response = clients_table.get_item(Key={'ClienteId': client_id})
        client = response['Item']
        send_email(client['Email'], fund_name, amount)
        # send_whatsapp(client['Phone'], fund_name, amount)
        print('Notificaciones enviadas con éxito')

    def send_email(to_email, fund_name, amount):
        sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        email_data = {
            "personalizations": [{
                "to": [{"email": to_email}],
                "subject": "Suscripción a Fondo Exitosa"
            }],
            "from": {"email": "ggonzalez@assist.com.co"},
            "content": [{
                "type": "text/plain",
                "value": f"Te has suscrito exitosamente al fondo {fund_name} con un monto de {amount}."
            }]
        }

        try:
            response = requests.post(
                "https://api.sendgrid.com/v3/mail/send",
                headers={"Authorization": f"Bearer {sendgrid_api_key}", "Content-Type": "application/json"},
                json=email_data
            )
            response.raise_for_status()
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            print(f"Response content: {response.content}")
        except Exception as err:
            print(f"Other error occurred: {err}")
        else:
            print("Correo enviado exitosamente")


    @app.route('/transactions', methods=['GET'])
    def transactions():
        client_id = request.args.get('client_id')
        response = transactions_table.query(
            IndexName='ClientID-index',
            KeyConditionExpression=Key('ClientID').eq(client_id)
        )
        return jsonify(response['Items']), 200

    @app.route('/clients', methods=['GET', 'POST'])
    def clients():
        if request.method == 'POST':
            data = request.get_json()
            client_id = str(uuid.uuid4())
            clients_table.put_item(
                Item={
                    'ClienteId': client_id,
                    'Name': data['name'],
                    'Email': data['email'],
                    'Phone': data['phone']
                }
            )
            return jsonify({'message': 'Cliente creado con éxito.', 'client_id': client_id}), 201
        else:
            response = clients_table.scan()
            return jsonify(response['Items']), 200

    @app.route('/funds', methods=['GET'])
    def get_funds():
        response = funds_table.scan()
        return jsonify(response['Items']), 200

    @app.route('/upload_clients', methods=['POST'])
    def upload_clients():
        # Aquí debes implementar la lógica para procesar el archivo y cargar los datos en la tabla de clientes
        return jsonify({'message': 'Clientes cargados con éxito'}), 200

    @app.route('/all_transactions', methods=['GET'])
    def get_all_transactions():
        response = transactions_table.scan()
        return jsonify(response['Items']), 200

    @app.route('/client_funds', methods=['GET'])
    def get_client_funds():
        client_id = request.args.get('client_id')
        response = transactions_table.query(
            IndexName='ClientID-index',
            KeyConditionExpression=Key('ClientID').eq(client_id)
        )
        funds = [txn for txn in response['Items'] if txn['Type'] == 'Subscription']
        return jsonify(funds), 200

    @app.route('/unsubscribe', methods=['POST'])
    def unsubscribe():
        data = request.get_json()
        client_id = data['client_id']
        fund_id = data['fund_id']
        response = transactions_table.query(
            IndexName='ClientID-index',
            KeyConditionExpression=Key('ClientID').eq(client_id)
        )
        subscription_transactions = [txn for txn in response['Items'] if txn['FundID'] == fund_id and txn['Type'] == 'Subscription']
        if subscription_transactions:
            transaction_id = subscription_transactions[0]['TransaccionId']
            transactions_table.delete_item(
                Key={'TransaccionId': transaction_id}
            )
            return jsonify({'message': 'Transacción eliminada con éxito.', 'transaction_id': transaction_id}), 200
        else:
            return jsonify({'message': 'Transacción no encontrada.'}), 404

    @app.route('/client/<string:client_id>', methods=['DELETE'])
    def delete_client(client_id):
        try:
            clients_table.delete_item(
                Key={'ClienteId': client_id}
            )
            return jsonify({'message': 'Cliente eliminado con éxito'}), 200
        except Exception as e:
            return jsonify({'message': 'Error eliminando el cliente', 'error': str(e)}), 500

    @app.route('/client', methods=['POST'])
    def create_client():
        try:
            data = request.get_json()
            client_id = str(uuid.uuid4())
            clients_table.put_item(
                Item={
                    'ClienteId': client_id,
                    'Name': data['name'],
                    'Email': data['email'],
                    'Phone': data['phone']
                }
            )
            return jsonify({'message': 'Cliente creado con éxito.', 'client_id': client_id}), 201
        except Exception as e:
            return jsonify({'message': 'Error creando el cliente.', 'error': str(e)}), 500

    @app.route('/transaction/<string:transaction_id>', methods=['DELETE'])
    def delete_transaction(transaction_id):
        try:
            transactions_table.delete_item(
                Key={'TransaccionId': transaction_id}
            )
            return jsonify({'message': 'Transacción eliminada con éxito'}), 200
        except Exception as e:
            return jsonify({'message': 'Error eliminando la transacción', 'error': str(e)}), 500
