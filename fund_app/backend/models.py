import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
clients_table = dynamodb.Table('Clients')
transactions_table = dynamodb.Table('Transactions')
funds_table = dynamodb.Table('Funds')

def get_fund_minimum(fund_id):
    response = funds_table.get_item(Key={'Id': int(fund_id)})  # Asegúrate de que 'Id' sea del tipo correcto
    if 'Item' in response:
        return int(response['Item']['MontoMinimo'])
    else:
        raise ValueError(f'Fund with ID {fund_id} not found')
