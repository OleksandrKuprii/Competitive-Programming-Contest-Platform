"""Toucan API."""
import json
from datetime import datetime
from functools import wraps

from aiohttp import web
from aiohttp.web import Application, Response, _run_app, json_response

import aiohttp_cors

import jose
from jose import jwt

from six.moves.urllib.request import urlopen

from toucan import task
from toucan.coreservices import submission
from toucan.dataclass import UserSubmission


routes = web.RouteTableDef()

AUTH0_DOMAIN = 'dev-gly-dk66.eu.auth0.com'
API_IDENTIFIER = 'w5IiSiIhAoOW8dQvAATlvbaS2eP47H0Q'
ALGORITHMS = ["RS256"]


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
            return json_response({'code': 'invalid token', 'description':
                                  'error decoding token headers'}, status=401)

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

    submission_id = await submission.add_submission(submission_data)

    return json_response({
        'submission_id': submission_id,
        'timestamp': timestamp.isoformat()
    })


@routes.get('/tasks')
async def get_tasks(request):
    """GET tasks."""
    params = request.rel_url.query

    if list(params.values()).count('') or \
            ('number' not in list(params.keys()) or
             'offset' not in list(params.keys())):
        return Response(status=400)

    number = int(params.get('number'))
    offset = int(params.get('offset'))

    tasks = await task.get_tasks('', number, offset)

    return json_response(tasks)


@routes.get('/tasks/auth')
@requires_auth
async def get_tasks_auth(request, **kwargs):
    """Get task for authorised user."""
    params = request.rel_url.query

    user_info = kwargs['user_info']
    if list(params.values()).count('') or \
            ('number' not in list(params.keys()) or
             'offset' not in list(params.keys())):
        return Response(status=400)

    user_id = user_info['sub']
    number = int(params.get('number'))
    offset = int(params.get('offset'))

    tasks = await task.get_tasks(user_id, number, offset)

    return json_response(tasks)


@routes.get('/task/{alias}')
async def get_task_by_alias(request):
    """GET task by alias."""
    alias = request.match_info['alias']
    task_info = await task.get_task_info(alias)

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

    alias = request.match_info['alias']
    task_info = await task.get_task_info(alias)

    if task_info is None:
        return Response(status=400)

    user_id = user_info['sub']
    task_id = await task.get_task_id_from_alias(alias)
    submission_id = await submission.get_submission_id_from_bests(
        user_id, task_id)

    result = await submission.get_result(submission_id, user_id)

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

    submissions = await submission.get_all(user_id, number, offset)

    return json_response(submissions)


@routes.get(r'/submission/{submission_id:\d+}')
@requires_auth
async def get_submission(request, **kwargs):
    """Get submission by id."""
    user_info = kwargs['user_info']
    user_id = user_info['sub']
    submission_id = int(request.match_info['submission_id'])

    submission_data = await submission.get_submission(submission_id, user_id)

    return json_response(submission_data)


@routes.get(r'/result/{submission_id:\d+}')
@requires_auth
async def get_result(request, **kwargs):
    """Get result."""
    user_info = kwargs['user_info']
    user_id = user_info['sub']
    submission_id = int(request.match_info['submission_id'])

    result = await submission.get_result(submission_id, user_id)

    return json_response(result)


@routes.get(r'/test_results/{submission_id:\d+}')
@requires_auth
async def get_test_results(request, **kwargs):
    """Get all test results."""
    user_info = kwargs['user_info']
    user_id = user_info['sub']
    submission_id = int(request.match_info['submission_id'])

    tests = await submission.get_test_results(submission_id, user_id)

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


async def run():
    """Start api using existing event loop."""
    await _run_app(app, port=4000)
