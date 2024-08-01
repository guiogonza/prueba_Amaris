import boto3
from faker import Faker
import uuid

# Configuración de boto3 para DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

# Referencia a la tabla de transacciones y clientes
transactions_table = dynamodb.Table('Transactions')
clients_table = dynamodb.Table('Clients')
funds_table = dynamodb.Table('Funds')

fake = Faker()

def create_fake_transactions(n):
    try:
        # Obtener los IDs de los clientes
        clients_response = clients_table.scan()
        clients = clients_response['Items']
        client_ids = [client['ClienteId']['S'] for client in clients]

        # Obtener los IDs de los fondos
        funds_response = funds_table.scan()
        funds = funds_response['Items']
        fund_ids = [fund['Id']['N'] for fund in funds]

        for _ in range(n):
            client_id = fake.random_element(client_ids)
            fund_id = fake.random_element(fund_ids)
            transaction_type = fake.random_element(['Subscription', 'Unsubscription'])
            amount = fake.random_int(min=1000, max=1000000)

            transaction_id = str(uuid.uuid4())
            transaction = {
                'TransaccionId': transaction_id,
                'ClientID': client_id,
                'FundID': fund_id,
                'Amount': str(amount),
                'Type': transaction_type,
                'Timestamp': fake.date_time_this_year().isoformat()
            }

            try:
                transactions_table.put_item(Item=transaction)
                print(f"Created transaction {transaction_id}")
            except Exception as e:
                print(f"Error creating transaction {transaction_id}: {e}")
    except Exception as e:
        print(f"Error scanning tables: {e}")

if __name__ == '__main__':
    create_fake_transactions(5)
