"""Toucan API."""
import asyncio
import json
import logging
import re

from datetime import datetime
from functools import wraps

from aiohttp import web
from aiohttp.web import Application, Response, _run_app, json_response

import aiohttp_cors


from asyncpg.pool import Pool

import jose
from jose import jwt

from six.moves.urllib.request import urlopen

import database
import submission
import task
from dataclass import UserSubmission


routes = web.RouteTableDef()

AUTH0_DOMAIN = 'dev-gly-dk66.eu.auth0.com'
API_IDENTIFIER = 'toucan-api'
ALGORITHMS = ["RS256"]

logging.basicConfig(filename='api.log',
                    filemode='w',
                    level=logging.INFO,
                    format='%(asctime)s %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S')

pool: Pool


def get_token_auth_header(request):
    """Obtain the access token from the Authorization Header."""
    auth = request.headers.get("Authorization", None)

    if not auth:
        return json_response({"code": "authorization_header_missing",
                              "description":
                                  "Authorization header is expected"},
                             status=401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        return json_response({"code": "invalid_header",
                              "description":
                                  "Authorization header must start with"
                                  " Bearer"}, status=401)
    elif len(parts) == 1:
        return json_response({"code": "invalid_header",
                              "description": "Token not found"}, status=401)
    elif len(parts) > 2:
        return json_response({"code": "invalid_header",
                              "description":
                                  "Authorization header must be"
                                  " Bearer token"}, status=401)

    token = parts[1]
    return token


def requires_scope(required_scope, request):
    """Determine if the required scope is present in the access token.

    Args:
        required_scope (str): The scope required to access the resource
        request (Request): The variable, that contains request info
    """
    token = get_token_auth_header(request)
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("scope"):
        token_scopes = unverified_claims["scope"].split()
        for token_scope in token_scopes:
            if token_scope == required_scope:
                return True
    return False


def requires_auth(f):
    """Determine if the Access Token is valid."""
    @wraps(f)
    def decorated(*args, **kwargs):
        """Function-decorator."""
        request = args[0]

        token = get_token_auth_header(request)
        json_url = urlopen('https://' + AUTH0_DOMAIN +
                           "/.well-known/jwks.json")
        jwks = json.loads(json_url.read())

        try:
            unverified_header = jwt.get_unverified_header(token)
        except jose.exceptions.JWTError:
            return json_response(
                {'code': 'invalid token',
                 'description': 'error decoding token headers'},
                status=401)

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                kwargs['user_info'] = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_IDENTIFIER,
                    issuer='https://' + AUTH0_DOMAIN + '/'
                )
            except jwt.ExpiredSignatureError:
                return json_response({"code": "token_expired",
                                      "description": "token is expired"},
                                     status=401)
            except jwt.JWTClaimsError:
                return json_response({"code": "invalid_claims",
                                      "description": "incorrect claims, \
                                                     please"
                                                     "check the audience and "
                                                     "issuer"}, status=401)
            except Exception:
                return json_response({"code": "invalid_header",
                                      "description": "Unable to parse "
                                                     "authentication token."},
                                     status=401)

            return f(*args, **kwargs)
        return json_response({"code": "invalid_header",
                              "description": "Unable to find appropriate key"},
                             status=401)

    return decorated


def parse_task_params(params):
    """Parse tasks params."""
    required_params = ['number', 'offset']

    for param in required_params:
        try:
            params[param] = int(params[param])
        except (KeyError, ValueError):
            return

    sort_params = ['name_sort', 'category_sort', 'difficulty_sort',
                   'result_sort']

    for param in sort_params:
        try:
            if params[param] == '':
                del params[param]
            elif params[param] != 'DESC':
                params[param] = 'ASC'
        except KeyError:
            continue

    try:
        cats = params['categories'].strip(',').split(',')
        params['categories'] = {cat for cat in cats if cat != ''}
    except KeyError:
        pass

    try:
        difficulty = params['difficulty'].strip(',').split(',')
        params['difficulty'] = set()

        for diff in difficulty:
            diff = diff.strip()
            if diff.isnumeric():
                params['difficulty'].add(int(diff))
            else:
                reg = re.search(r'^(\d+)-(\d+)$', diff)
                if reg:
                    temp_diff = range(int(reg.group(1)), int(reg.group(2)) + 1)
                    for d in temp_diff:
                        params['difficulty'].add(d)
    except KeyError:
        pass

    try:
        results = params['result'].strip(',').split(',')
        result_map = {
            'full': 100,
            'partial': list(range(1, 100)),
            'zero': 0,
            'null': None
        }

        params['result'] = set()

        for r in results:
            r = r.strip()
            if re.match(r'^full|zero|null$', r):
                params['result'].add(result_map[r])
            elif r == 'partial':
                for i in result_map[r]:
                    params['result'].add(i)
            elif r.isnumeric():
                params['result'].add(int(r))
            else:
                reg = re.search(r'^(\d+)-(\d+)$', r)
                if reg:
                    temp_result = range(int(reg.group(1)),
                                        int(reg.group(2)) + 1)
                    for d in temp_result:
                        params['result'].add(d)
    except KeyError:
        pass

    return params


@routes.post('/submission')
@requires_auth
async def post_submission(request, **kwargs):
    """POST submission."""
    body = await request.json()
    user_info = kwargs['user_info']

    try:
        timestamp = datetime.now().astimezone()
        user_id = user_info['sub']
        submission_data = UserSubmission(**body, timestamp=timestamp,
                                         user_id=user_id)
    except TypeError:
        return Response(status=400)

    async with pool.acquire() as conn:
        submission_id = await submission.add_submission(submission_data, conn)

    return json_response({
        'submission_id': submission_id,
        'timestamp': timestamp.isoformat()
    })


@routes.get('/tasks')
async def get_tasks(request):
    """GET tasks."""
    params = dict(request.rel_url.query)

    params = parse_task_params(params)

    for key in ['result', 'result_sort']:
        try:
            del params[key]
        except KeyError:
            pass

    if params is None:
        return Response(status=400)

    async with pool.acquire() as conn:
        tasks = await task.get_tasks('', params, conn)

    return json_response(tasks)


@routes.get('/tasks/auth')
@requires_auth
async def get_tasks_auth(request, **kwargs):
    """Get task for authorised user."""
    params = dict(request.rel_url.query)

    params = parse_task_params(params)

    if params is None:
        return Response(status=400)

    user_info = kwargs['user_info']
    user_id = user_info['sub']

    async with pool.acquire() as conn:
        tasks = await task.get_tasks(user_id, params, conn)

    return json_response(tasks)


@routes.get('/task/{alias}')
async def get_task_by_alias(request):
    """GET task by alias."""
    alias = request.match_info['alias']

    async with pool.acquire() as conn:
        task_info = await task.get_task_info(alias, conn)

    if task_info is None:
        return Response(status=400)

    task_info['best_submission'] = {
        'result': None,
        'id': None
    }

    return json_response(task_info)


@routes.get('/task/auth/{alias}')
@requires_auth
async def get_task_by_alias_auth(request, **kwargs):
    """GET task by alias."""
    user_info = kwargs['user_info']

    async with pool.acquire() as conn:
        alias = request.match_info['alias']
        task_info = await task.get_task_info(alias, conn)

        if task_info is None:
            return Response(status=400)

        user_id = user_info['sub']
        task_id = await task.get_task_id_from_alias(alias, conn)
        submission_id = await submission.get_submission_id_from_bests(
            user_id, task_id, conn)

        result = await submission.get_result(submission_id, user_id, conn)

    task_info['best_submission'] = {
        'result': result,
        'id': submission_id
    }

    return json_response(task_info)


@routes.get('/submissions')
@requires_auth
async def get_submissions(request, **kwargs):
    """Get list of submissions."""
    params = request.rel_url.query
    user_info = kwargs['user_info']

    if list(params.values()).count('') or \
            ('number' not in list(params.keys()) or
             'offset' not in list(params.keys())):
        return Response(status=400)

    user_id = user_info['sub']
    number = int(params.get('number'))
    offset = int(params.get('offset'))

    async with pool.acquire() as conn:
        submissions = await submission.get_all(user_id, number, offset, conn)

    return json_response(submissions)


@routes.get(r'/submission/{submission_id:\d+}')
@requires_auth
async def get_submission(request, **kwargs):
    """Get submission by id."""
    user_info = kwargs['user_info']
    user_id = user_info['sub']
    submission_id = int(request.match_info['submission_id'])

    async with pool.acquire() as conn:
        submission_data = await submission.get_submission(submission_id,
                                                          user_id, conn)

    return json_response(submission_data)


@routes.get(r'/result/{submission_id:\d+}')
@requires_auth
async def get_result(request, **kwargs):
    """Get result."""
    user_info = kwargs['user_info']
    user_id = user_info['sub']
    submission_id = int(request.match_info['submission_id'])

    async with pool.acquire() as conn:
        result = await submission.get_result(submission_id, user_id, conn)

    return json_response(result)


@routes.get(r'/test_results/{submission_id:\d+}')
@requires_auth
async def get_test_results(request, **kwargs):
    """Get all test results."""
    user_info = kwargs['user_info']
    user_id = user_info['sub']
    submission_id = int(request.match_info['submission_id'])

    async with pool.acquire() as conn:
        tests = await submission.get_test_results(submission_id, user_id, conn)

    return json_response(tests)


app = Application()

cors = aiohttp_cors.setup(app,
                          defaults={
                              "*":
                                  aiohttp_cors.ResourceOptions(
                                      allow_credentials=True,
                                      expose_headers="*",
                                      allow_headers="*",
                                  )
                          })

app.add_routes(routes)

for route in app.router.routes():
    cors.add(route)


async def main():
    """Run api."""
    global pool
    pool = await database.establish_connection_from_env()

    await _run_app(app, port=4000)


if __name__ == '__main__':
    asyncio.run(main())
