import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    '''
    Business: Чат-бот Rusty AI отвечает на вопросы по игре Rust через Mistral AI
    Args: event с httpMethod, body (сообщения пользователя); context с request_id
    Returns: HTTP-ответ с текстом ответа ассистента
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    api_key = os.environ.get('MISTRAL_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'MISTRAL_API_KEY не настроен'}),
        }

    body_data = json.loads(event.get('body', '{}'))
    user_messages = body_data.get('messages', [])

    system_prompt = {
        'role': 'system',
        'content': (
            'Ты Rusty AI — эксперт по многопользовательской игре Rust от Facepunch Studios. '
            'Ты отлично разбираешься в крафте, оружии, базах, рейдах, электричестве, '
            'выживании, картах, обновлениях и механиках игры Rust. '
            'Отвечай дружелюбно, по делу и на русском языке. '
            'Если вопрос не про игру Rust — мягко напомни, что ты специализируешься на Rust.'
        ),
    }

    messages = [system_prompt] + user_messages

    payload = json.dumps({
        'model': 'mistral-large-latest',
        'messages': messages,
        'temperature': 0.7,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.mistral.ai/v1/chat/completions',
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode('utf-8'))
            answer = result['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        return {
            'statusCode': 502,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Mistral API error: {err_body}'}),
        }

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'reply': answer}, ensure_ascii=False),
    }
