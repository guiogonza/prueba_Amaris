import boto3
import uuid
from faker import Faker

fake = Faker()

# Configurar la conexión a DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Seleccionar la tabla de clientes
clients_table = dynamodb.Table('Clients')

# Crear datos falsos para clientes
def create_fake_clients(num_clients=5):
    for _ in range(num_clients):
        client_id = str(uuid.uuid4())
        print(f'Creating client with ID: {client_id}')
        try:
            clients_table.put_item(
                Item={
                    'ClienteId': client_id,  # Cambiado a ClienteId
                    'Name': fake.name(),
                    'Email': fake.email(),
                    'Phone': fake.phone_number()
                }
            )
            print(f'Created client {client_id}')
        except Exception as e:
            print(f'Error creating client {client_id}: {e}')

# Crear datos
create_fake_clients(5)
